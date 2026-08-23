import { globalCache } from '../../core/cache/MemoryCache';

export interface CashFlowItemDto {
  paymentDate: string;
  amortizationPercent: number;
  interestRateAnnualPercent: number;
  amortizationAmountUsd: number;
  interestAmountUsd: number;
  totalCashFlowUsd: number;
  residualPrincipalUsd: number;
  status: 'paid' | 'upcoming';
}

export interface BondDetailDto {
  ticker: string;
  name: string;
  isin: string;
  law: string;
  issuer: string;
  currency: string;
  emissionDate: string;
  maturityDate: string;
  currentPriceUsd: number;
  currentPriceArs: number;
  tirPercent: number;
  parityPercent: number;
  currentYieldPercent: number;
  modifiedDurationYears: number;
  nextPaymentDate: string;
  nextPaymentAmountUsd: number;
  outstandingPrincipalUsd: number;
  cashFlows: CashFlowItemDto[];
}

export class BondDetailService {
  private static readonly TTL_MS = 5 * 60 * 1000; // 5 mins

  static async getBondDetail(ticker: string = 'AL30'): Promise<BondDetailDto> {
    const key = `bond_detail_${ticker.toUpperCase()}`;

    return globalCache.getOrSet(
      key,
      async () => {
        const isAL30 = ticker.toUpperCase() === 'AL30';
        const isGD30 = ticker.toUpperCase() === 'GD30';

        const cashFlows: CashFlowItemDto[] = [
          { paymentDate: '09/07/2024', amortizationPercent: 4.0, interestRateAnnualPercent: 0.75, amortizationAmountUsd: 4.0, interestAmountUsd: 0.38, totalCashFlowUsd: 4.38, residualPrincipalUsd: 96.0, status: 'paid' },
          { paymentDate: '09/01/2025', amortizationPercent: 8.0, interestRateAnnualPercent: 0.75, amortizationAmountUsd: 8.0, interestAmountUsd: 0.36, totalCashFlowUsd: 8.36, residualPrincipalUsd: 88.0, status: 'paid' },
          { paymentDate: '09/07/2025', amortizationPercent: 8.0, interestRateAnnualPercent: 0.75, amortizationAmountUsd: 8.0, interestAmountUsd: 0.33, totalCashFlowUsd: 8.33, residualPrincipalUsd: 80.0, status: 'upcoming' },
          { paymentDate: '09/01/2026', amortizationPercent: 8.0, interestRateAnnualPercent: 0.75, amortizationAmountUsd: 8.0, interestAmountUsd: 0.3, totalCashFlowUsd: 8.3, residualPrincipalUsd: 72.0, status: 'upcoming' },
          { paymentDate: '09/07/2026', amortizationPercent: 8.0, interestRateAnnualPercent: 0.75, amortizationAmountUsd: 8.0, interestAmountUsd: 0.27, totalCashFlowUsd: 8.27, residualPrincipalUsd: 64.0, status: 'upcoming' },
          { paymentDate: '09/01/2027', amortizationPercent: 8.0, interestRateAnnualPercent: 0.75, amortizationAmountUsd: 8.0, interestAmountUsd: 0.24, totalCashFlowUsd: 8.24, residualPrincipalUsd: 56.0, status: 'upcoming' },
          { paymentDate: '09/07/2027', amortizationPercent: 8.0, interestRateAnnualPercent: 0.75, amortizationAmountUsd: 8.0, interestAmountUsd: 0.21, totalCashFlowUsd: 8.21, residualPrincipalUsd: 48.0, status: 'upcoming' },
          { paymentDate: '09/01/2028', amortizationPercent: 8.0, interestRateAnnualPercent: 0.75, amortizationAmountUsd: 8.0, interestAmountUsd: 0.18, totalCashFlowUsd: 8.18, residualPrincipalUsd: 40.0, status: 'upcoming' },
          { paymentDate: '09/07/2028', amortizationPercent: 8.0, interestRateAnnualPercent: 0.75, amortizationAmountUsd: 8.0, interestAmountUsd: 0.15, totalCashFlowUsd: 8.15, residualPrincipalUsd: 32.0, status: 'upcoming' },
          { paymentDate: '09/01/2029', amortizationPercent: 8.0, interestRateAnnualPercent: 0.75, amortizationAmountUsd: 8.0, interestAmountUsd: 0.12, totalCashFlowUsd: 8.12, residualPrincipalUsd: 24.0, status: 'upcoming' },
          { paymentDate: '09/07/2029', amortizationPercent: 8.0, interestRateAnnualPercent: 0.75, amortizationAmountUsd: 8.0, interestAmountUsd: 0.09, totalCashFlowUsd: 8.09, residualPrincipalUsd: 16.0, status: 'upcoming' },
          { paymentDate: '09/01/2030', amortizationPercent: 8.0, interestRateAnnualPercent: 0.75, amortizationAmountUsd: 8.0, interestAmountUsd: 0.06, totalCashFlowUsd: 8.06, residualPrincipalUsd: 8.0, status: 'upcoming' },
          { paymentDate: '09/07/2030', amortizationPercent: 8.0, interestRateAnnualPercent: 0.75, amortizationAmountUsd: 8.0, interestAmountUsd: 0.03, totalCashFlowUsd: 8.03, residualPrincipalUsd: 0.0, status: 'upcoming' },
        ];

        return {
          ticker: isAL30 ? 'AL30' : isGD30 ? 'GD30' : ticker,
          name: isAL30
            ? 'Bonos de la Rep. Argentina en USD Step-Up 2030 (Ley Argentina)'
            : 'Bonos Globales de la Rep. Argentina en USD 2030 (Ley New York)',
          isin: isAL30 ? 'ARARGE3209Y4' : 'US040114HX11',
          law: isAL30 ? 'Argentina' : 'Nueva York (Indenture 2016)',
          issuer: 'República Argentina - Ministerio de Economía',
          currency: 'USD',
          emissionDate: '04/09/2020',
          maturityDate: '09/07/2030',
          currentPriceUsd: isAL30 ? 72.85 : 77.4,
          currentPriceArs: isAL30 ? 86800.0 : 92250.0,
          tirPercent: isAL30 ? 11.45 : 10.25,
          parityPercent: isAL30 ? 72.85 : 77.4,
          currentYieldPercent: 1.03,
          modifiedDurationYears: isAL30 ? 2.15 : 2.22,
          nextPaymentDate: '09/07/2025',
          nextPaymentAmountUsd: 8.33,
          outstandingPrincipalUsd: 88.0,
          cashFlows,
        };
      },
      BondDetailService.TTL_MS
    );
  }
}
