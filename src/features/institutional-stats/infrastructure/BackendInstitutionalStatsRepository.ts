import {
  InstitutionalStatsRepositoryPort,
  InstitutionalStatsDto,
} from '../application/InstitutionalStatsRepositoryPort';
import { BcraBalanceSheet } from '../domain/BcraBalanceSheet';
import { InterestRateMetric } from '../domain/InterestRateMetric';
import { TimeSeries } from '@core/domain/TimeSeries';
import { smartCache, CACHE_TTL } from '@core/infrastructure/SmartCacheAdapter';
import { MockInstitutionalStatsRepository } from './MockInstitutionalStatsRepository';
import { API_CONFIG } from '@core/config/api.config';

export class BackendInstitutionalStatsRepository
  implements InstitutionalStatsRepositoryPort
{
  private fallbackRepo = new MockInstitutionalStatsRepository();

  async getInstitutionalStats(): Promise<InstitutionalStatsDto> {
    const cacheKey = 'institutional_stats_backend';

    return await smartCache.getOrFetch<InstitutionalStatsDto>(
      cacheKey,
      async () => {
        try {
          const fallbackData = await this.fallbackRepo.getInstitutionalStats();

          // Try fetching live IPC and Plazos Fijos from backend
          const [macroRes, ratesRes] = await Promise.all([
            fetch(API_CONFIG.getEndpoint('/api/v1/macro/overview')).catch(() => null),
            fetch(API_CONFIG.getEndpoint('/api/v1/rates/plazos-fijos')).catch(() => null),
          ]);

          let liveRates = fallbackData.rates;
          let liveInflationSeries = fallbackData.series.inflationIndec;

          if (ratesRes && ratesRes.ok) {
            const ratesJson = await ratesRes.json();
            const bankList = ratesJson.data || [];
            if (bankList.length > 0) {
              const bna = bankList.find((b: any) => b.entidad.includes('NACION')) || bankList[0];
              const pfTna = bna.tnaClientes || 19.0;
              const tem = (pfTna * 30) / 365;
              const tea = (Math.pow(1 + tem / 100, 12) - 1) * 100;

              liveRates = liveRates.map((r) => {
                if (r.id === 'plazo-fijo') {
                  return new InterestRateMetric({
                    id: r.id,
                    name: `Plazo Fijo (${bna.entidad.split(' ')[0]} ${bna.entidad.split(' ')[1] || ''})`,
                    tna: pfTna,
                    tea: Number(tea.toFixed(2)),
                    tem: Number(tem.toFixed(2)),
                    type: 'deposits',
                    description: 'Tasa nominal anual vigente relevada por el BCRA / ArgentinaDatos',
                  });
                }
                return r;
              });
            }
          }

          if (macroRes && macroRes.ok) {
            const macroJson = await macroRes.json();
            const hist = macroJson.data?.inflation?.series12Months || [];
            if (hist.length > 0) {
              const points = hist.slice(-8).map((p: any) => ({
                timestamp: p.period || 'Mes',
                value: p.value,
                label: `${p.value}% (${p.period || ''})`,
              }));
              liveInflationSeries = new TimeSeries('Inflación Mensual INDEC (Argly / ArgentinaDatos)', '%', points);
            }
          }

          return {
            balanceSheet: fallbackData.balanceSheet,
            rates: liveRates,
            series: {
              ...fallbackData.series,
              inflationIndec: liveInflationSeries,
            },
            tradeBalanceSummary: fallbackData.tradeBalanceSummary,
          };
        } catch (e) {
          console.warn('BackendInstitutionalStatsRepository error, using fallback:', e);
          return await this.fallbackRepo.getInstitutionalStats();
        }
      },
      CACHE_TTL.BCRA_RATES
    );
  }
}
