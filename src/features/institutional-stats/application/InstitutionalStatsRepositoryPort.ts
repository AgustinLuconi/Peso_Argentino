import { BcraBalanceSheet } from '../domain/BcraBalanceSheet';
import { InterestRateMetric } from '../domain/InterestRateMetric';
import { MacroComparativeData } from '../domain/MacroComparativeSeries';

export interface InstitutionalStatsDto {
  balanceSheet: BcraBalanceSheet;
  rates: InterestRateMetric[];
  series: MacroComparativeData;
  tradeBalanceSummary: {
    exportsUsd: number;
    importsUsd: number;
    surplusUsd: number;
    period: string;
  };
}

export interface InstitutionalStatsRepositoryPort {
  getInstitutionalStats(): Promise<InstitutionalStatsDto>;
}
