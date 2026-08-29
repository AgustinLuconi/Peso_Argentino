import {
  InstitutionalStatsRepositoryPort,
  InstitutionalStatsDto,
} from '../application/InstitutionalStatsRepositoryPort';
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

          // Fetch full historical series from Neon Backend API
          const [ratesRes, ipcSeriesRes, reservasSeriesRes, baseMonSeriesRes, balanzaSeriesRes] = await Promise.all([
            fetch(API_CONFIG.getEndpoint('/api/v1/macro/overview')).catch(() => null),
            fetch(API_CONFIG.getEndpoint('/api/v1/rates/plazos-fijos')).catch(() => null),
            fetch(API_CONFIG.getEndpoint('/api/v1/macro/series/ipc?limit=100')).catch(() => null),
            fetch(API_CONFIG.getEndpoint('/api/v1/macro/series/reservas?limit=100')).catch(() => null),
            fetch(API_CONFIG.getEndpoint('/api/v1/macro/series/base_monetaria?limit=100')).catch(() => null),
            fetch(API_CONFIG.getEndpoint('/api/v1/macro/series/balanza_comercial?limit=100')).catch(() => null),
          ]);

          let liveRates = fallbackData.rates;
          let liveInflationSeries = fallbackData.series.inflationIndec;
          let liveReservesSeries = fallbackData.series.grossReservesSeries;
          let liveBaseMonSeries = fallbackData.series.monetaryBaseSeries;
          let liveBalanzaSeries = fallbackData.series.tradeBalanceSeries;

          // 1. Process Bank Rates
          if (ratesRes && ratesRes.ok) {
            const ratesJson = await ratesRes.json();
            const bankList = ratesJson.data || [];
            if (bankList.length > 0) {
              const bna = bankList.find((b: any) => b.entidad?.includes('NACION')) || bankList[0];
              const pfTna = bna.tnaClientes || 30.5;
              const tem = (pfTna * 30) / 365;
              const tea = (Math.pow(1 + tem / 100, 12) - 1) * 100;

              liveRates = liveRates.map((r) => {
                if (r.id === 'plazo-fijo') {
                  return new InterestRateMetric({
                    id: r.id,
                    name: `Plazo Fijo (${bna.entidad?.split(' ')[0]} ${bna.entidad?.split(' ')[1] || ''})`,
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

          // 2. Process Full Historical IPC Series
          if (ipcSeriesRes && ipcSeriesRes.ok) {
            const ipcJson = await ipcSeriesRes.json();
            const pts = ipcJson.data || [];
            if (pts.length > 0) {
              const mappedPoints = pts.slice(-24).map((p: any) => ({
                timestamp: p.period,
                value: p.value,
                label: `${p.value}% (${p.period})`,
              }));
              liveInflationSeries = new TimeSeries('Inflación Mensual INDEC (Histórico Multi-anual)', '%', mappedPoints);
            }
          }

          // 3. Process Full Historical Reserves Series
          if (reservasSeriesRes && reservasSeriesRes.ok) {
            const resJson = await reservasSeriesRes.json();
            const pts = resJson.data || [];
            if (pts.length > 0) {
              const mappedPoints = pts.map((p: any) => ({
                timestamp: p.period,
                value: p.value,
                label: `US$ ${p.value.toLocaleString('es-AR')} M (${p.period})`,
              }));
              liveReservesSeries = new TimeSeries('Reservas Brutas BCRA (Histórico Multi-anual)', 'USD M', mappedPoints);
            }
          }

          // 4. Process Full Historical Base Monetaria Series
          if (baseMonSeriesRes && baseMonSeriesRes.ok) {
            const bmJson = await baseMonSeriesRes.json();
            const pts = bmJson.data || [];
            if (pts.length > 0) {
              const mappedPoints = pts.map((p: any) => ({
                timestamp: p.period,
                value: Number((p.value / 1000).toFixed(2)), // Convert to Billones for visual clarity
                label: `$ ${(p.value / 1000).toFixed(2)} Billones (${p.period})`,
              }));
              liveBaseMonSeries = new TimeSeries('Base Monetaria BCRA (Histórico Multi-anual)', '$ B', mappedPoints);
            }
          }

          // 5. Process Full Historical Balanza Comercial Series
          if (balanzaSeriesRes && balanzaSeriesRes.ok) {
            const bcJson = await balanzaSeriesRes.json();
            const pts = bcJson.data || [];
            if (pts.length > 0) {
              const mappedPoints = pts.map((p: any) => ({
                timestamp: p.period,
                value: p.value,
                label: `US$ ${p.value > 0 ? '+' : ''}${p.value} M (${p.period})`,
              }));
              liveBalanzaSeries = new TimeSeries('Superávit Comercial ICA INDEC (Histórico Multi-anual)', 'USD M', mappedPoints);
            }
          }

          return {
            balanceSheet: fallbackData.balanceSheet,
            rates: liveRates,
            series: {
              inflationIndec: liveInflationSeries,
              grossReservesSeries: liveReservesSeries,
              monetaryBaseSeries: liveBaseMonSeries,
              tradeBalanceSeries: liveBalanzaSeries,
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
