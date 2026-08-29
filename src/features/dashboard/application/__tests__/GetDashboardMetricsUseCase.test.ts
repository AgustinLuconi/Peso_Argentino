import { describe, it, expect } from 'vitest';
import { GetDashboardMetricsUseCase } from '../GetDashboardMetricsUseCase';
import { DashboardRepositoryPort, DashboardMetricsDto } from '../DashboardRepositoryPort';
import { MarketQuote } from '../../domain/MarketQuote';
import { MacroKpi } from '../../domain/MacroKpi';
import { TimeSeries } from '@core/domain/TimeSeries';

describe('GetDashboardMetricsUseCase', () => {
  const mockDto: DashboardMetricsDto = {
    quotes: [
      new MarketQuote({
        type: 'blue',
        name: 'Dólar Blue',
        buyPrice: 1330,
        sellPrice: 1350,
        variation24h: 0.75,
        historicalSparkline: [1340, 1350],
        updatedAt: '2026-08-29T12:00:00Z',
      }),
      new MarketQuote({
        type: 'oficial',
        name: 'Dólar Oficial',
        buyPrice: 1040,
        sellPrice: 1080,
        variation24h: 0.0,
        historicalSparkline: [1080, 1080],
        updatedAt: '2026-08-29T12:00:00Z',
      }),
    ],
    kpis: [
      new MacroKpi({
        id: 'riesgo-pais',
        title: 'Riesgo País',
        value: '505 bps',
        numericValue: 505,
        unit: 'bps',
        variation: -5.0,
        period: 'vs día anterior',
        historicalSeries: [520, 515, 510, 505],
        category: 'debt',
      }),
    ],
    breachHistory: new TimeSeries('Brecha', '%', []),
    lastUpdated: '2026-08-29T12:00:00Z',
  };

  const mockRepo: DashboardRepositoryPort = {
    getDashboardMetrics: async () => mockDto,
    getDollarQuoteByType: async (type: string) =>
      mockDto.quotes.find((q) => q.type === type) || null,
  };

  it('should fetch dashboard metrics and correctly compute quote spread', async () => {
    const useCase = new GetDashboardMetricsUseCase(mockRepo);
    const result = await useCase.execute();

    expect(result.quotes).toHaveLength(2);
    const blue = result.quotes[0];
    expect(blue.type).toBe('blue');
    expect(blue.spread.amount).toBe(20); // 1350 - 1330
    expect(blue.spreadPercent.value).toBeCloseTo((20 / 1330) * 100, 2);

    expect(result.kpis[0].id).toBe('riesgo-pais');
    expect(result.kpis[0].numericValue).toBe(505);
  });
});
