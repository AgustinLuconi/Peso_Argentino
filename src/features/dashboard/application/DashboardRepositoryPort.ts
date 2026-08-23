import { MarketQuote } from '../domain/MarketQuote';
import { MacroKpi } from '../domain/MacroKpi';
import { TimeSeries } from '@core/domain/TimeSeries';

export interface DashboardMetricsDto {
  quotes: MarketQuote[];
  kpis: MacroKpi[];
  breachHistory: TimeSeries;
  lastUpdated: string;
}

export interface DashboardRepositoryPort {
  getDashboardMetrics(): Promise<DashboardMetricsDto>;
  getDollarQuoteByType(type: string): Promise<MarketQuote | null>;
}
