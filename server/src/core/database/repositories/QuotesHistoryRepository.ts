import { DatabaseConnection } from '../DatabaseConnection';
import { DolarQuote } from '../../../modules/dolar/domain/DolarQuote';

export interface QuoteHistoryPoint {
  readonly id: number;
  readonly quoteType: string;
  readonly name: string;
  readonly buyPrice: number;
  readonly sellPrice: number;
  readonly spread: number;
  readonly variation24h: number;
  readonly recordedAt: string;
}

export class QuotesHistoryRepository {
  /**
   * Guarda un lote de cotizaciones actuales en el histórico persistente de Neon
   */
  static async saveSnapshot(quotes: readonly DolarQuote[]): Promise<void> {
    if (!DatabaseConnection.isConfigured() || quotes.length === 0) {
      return;
    }

    try {
      for (const q of quotes) {
        await DatabaseConnection.execute(
          `INSERT INTO quotes_history (quote_type, name, buy_price, sell_price, spread, variation_24h)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [q.type, q.name, q.buyPrice, q.sellPrice, q.spread, q.variation24h]
        );
      }
    } catch (err) {
      console.error('[QuotesHistoryRepository] Error al guardar snapshot en Neon:', err);
    }
  }

  /**
   * Obtiene la serie histórica de una cotización específica según timeframe (1M, 3M, 6M, 1Y, 3Y, ALL)
   */
  static async getHistory(
    quoteType: string,
    limit: number = 30,
    timeframe?: string
  ): Promise<readonly QuoteHistoryPoint[]> {
    let days = 30;
    if (timeframe) {
      switch (timeframe.toUpperCase()) {
        case '1M':
          days = 30;
          break;
        case '3M':
          days = 90;
          break;
        case '6M':
          days = 180;
          break;
        case '1Y':
          days = 365;
          break;
        case '3Y':
          days = 1095;
          break;
        case 'ALL':
          days = 2000;
          break;
        default:
          days = limit;
      }
    } else {
      days = limit;
    }

    const rows = await DatabaseConnection.query<QuoteHistoryPoint>(
      `SELECT 
        id,
        quote_type as "quoteType",
        name,
        buy_price::float as "buyPrice",
        sell_price::float as "sellPrice",
        spread::float as spread,
        variation_24h::float as "variation24h",
        recorded_at as "recordedAt"
      FROM quotes_history
      WHERE quote_type = $1
      ORDER BY recorded_at DESC
      LIMIT $2`,
      [quoteType, days]
    );

    // Retornar en orden cronológico ascendente para gráficos
    return [...rows].reverse();
  }

  /**
   * Obtiene el conteo total de registros históricos guardados
   */
  static async getTotalRecordsCount(): Promise<number> {
    const result = await DatabaseConnection.queryOne<{ total: string | number }>(
      'SELECT COUNT(*)::int as total FROM quotes_history'
    );

    if (!result) return 0;
    return typeof result.total === 'number' ? result.total : Number(result.total) || 0;
  }
}
