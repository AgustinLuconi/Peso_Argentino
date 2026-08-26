import { BondRepositoryPort } from '../application/BondRepositoryPort';
import { BondDetail } from '../domain/BondDetail';
import { smartCache, CACHE_TTL } from '@core/infrastructure/SmartCacheAdapter';
import { MockBondRepository } from './MockBondRepository';
import { API_CONFIG } from '@core/config/api.config';

export class BackendBondRepository implements BondRepositoryPort {
  private fallbackRepo = new MockBondRepository();
  private backendBaseUrl = API_CONFIG.getEndpoint('/api/v1/bonds');

  async getAllAvailableBonds(): Promise<Array<{ ticker: string; name: string }>> {
    return this.fallbackRepo.getAllAvailableBonds();
  }

  async getBondByTicker(ticker: string): Promise<BondDetail | null> {
    const cacheKey = `bond_detail_backend_${ticker.toUpperCase()}`;

    return await smartCache.getOrFetch<BondDetail | null>(
      cacheKey,
      async () => {
        try {
          const res = await fetch(`${this.backendBaseUrl}/${ticker.toUpperCase()}`);
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              const d = json.data;

              return new BondDetail({
                ticker: d.ticker,
                isin: d.isin,
                name: d.name,
                issuer: d.issuer,
                law: d.law,
                issueDate: d.emissionDate,
                maturityDate: d.maturityDate,
                priceArs: d.currentPriceArs,
                priceMep: d.currentPriceUsd,
                priceCable: d.currentPriceUsd + 0.5,
                parity: d.parityPercent,
                tir: d.tirPercent,
                modifiedDuration: d.modifiedDurationYears,
                couponRate: 0.75,
                technicalValue: 100.0,
                accruedInterest: 0.12,
                cashFlows: (d.cashFlows || []).map((cf: any) => ({
                  paymentDate: cf.paymentDate,
                  interestRate: cf.interestRateAnnualPercent,
                  interestAmountUsd: cf.interestAmountUsd,
                  amortizationPercent: cf.amortizationPercent,
                  amortizationAmountUsd: cf.amortizationAmountUsd,
                  totalCashFlowUsd: cf.totalCashFlowUsd,
                  remainingCapitalPercent: cf.residualPrincipalUsd,
                  status: cf.status === 'paid' ? 'paid' : cf.paymentDate.includes('2025') ? 'upcoming' : 'future',
                })),
              });
            }
          }
        } catch (e) {
          console.warn('[BackendBondRepository] Error contacting backend:', e);
        }

        return await this.fallbackRepo.getBondByTicker(ticker);
      },
      CACHE_TTL.MARKET_ASSETS
    );
  }
}
