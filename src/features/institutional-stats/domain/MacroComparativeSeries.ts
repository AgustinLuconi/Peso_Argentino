import { TimeSeries } from '@core/domain/TimeSeries';

export interface MacroComparativeData {
  inflationIndec: TimeSeries;
  monetaryBaseSeries: TimeSeries;
  grossReservesSeries: TimeSeries;
  tradeBalanceSeries: TimeSeries;
}
