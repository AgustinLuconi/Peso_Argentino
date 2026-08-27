import { HttpClient } from './HttpClient';

export interface YahooChartMeta {
  currency?: string;
  symbol: string;
  regularMarketPrice: number;
  chartPreviousClose: number;
  regularMarketVolume?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  exchangeName?: string;
  timestamp?: number[];
  closes?: number[];
}

export class YahooFinanceAdapter {
  private static readonly HEADERS = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
  };

  /**
   * Obtiene la cotización en vivo y serie de precios de un ticker en Yahoo Finance REST v8
   */
  static async getChart(ticker: string, range: string = '5d', interval: string = '1d'): Promise<YahooChartMeta | null> {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${interval}&range=${range}`;
      const res = await HttpClient.get<any>(url, {
        headers: this.HEADERS,
        timeoutMs: 4500,
      });

      const result = res?.chart?.result?.[0];
      if (!result) return null;

      const meta = result.meta;
      const timestamps = result.timestamp || [];
      const quote = result.indicators?.quote?.[0] || {};
      const closes = (quote.close || []).filter((c: any) => typeof c === 'number' && !isNaN(c));

      return {
        currency: meta.currency,
        symbol: meta.symbol || ticker,
        regularMarketPrice: Number(meta.regularMarketPrice || closes[closes.length - 1] || 0),
        chartPreviousClose: Number(meta.chartPreviousClose || closes[0] || meta.regularMarketPrice || 0),
        regularMarketVolume: Number(meta.regularMarketVolume || 0),
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ? Number(meta.fiftyTwoWeekHigh) : undefined,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow ? Number(meta.fiftyTwoWeekLow) : undefined,
        regularMarketDayHigh: meta.regularMarketDayHigh ? Number(meta.regularMarketDayHigh) : undefined,
        regularMarketDayLow: meta.regularMarketDayLow ? Number(meta.regularMarketDayLow) : undefined,
        exchangeName: meta.exchangeName,
        timestamp: timestamps,
        closes,
      };
    } catch {
      return null;
    }
  }

  /**
   * Consulta múltiples tickers en paralelo con límite de concurrencia para velocidad y resiliencia
   */
  static async getBatchQuotes(tickers: string[]): Promise<Map<string, YahooChartMeta>> {
    const results = new Map<string, YahooChartMeta>();
    const batchSize = 6;

    for (let i = 0; i < tickers.length; i += batchSize) {
      const batch = tickers.slice(i, i + batchSize);
      const settled = await Promise.allSettled(batch.map((t) => this.getChart(t)));

      settled.forEach((res, idx) => {
        if (res.status === 'fulfilled' && res.value) {
          results.set(batch[idx], res.value);
        }
      });
    }

    return results;
  }
}
