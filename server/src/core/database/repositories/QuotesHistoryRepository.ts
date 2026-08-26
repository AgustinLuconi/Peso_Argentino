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
   * Guarda un lote de cotizaciones actuales en el histórico persistente
   */
  static saveSnapshot(quotes: readonly DolarQuote[]): void {
    const db = DatabaseConnection.getInstance();
    const insertStmt = db.prepare(`
      INSERT INTO quotes_history (quote_type, name, buy_price, sell_price, spread, variation_24h)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    db.exec('BEGIN TRANSACTION;');
    try {
      for (const q of quotes) {
        insertStmt.run(
          q.type,
          q.name,
          q.buyPrice,
          q.sellPrice,
          q.spread,
          q.variation24h
        );
      }
      db.exec('COMMIT;');
    } catch (err) {
      db.exec('ROLLBACK;');
      console.error('[QuotesHistoryRepository] Error al guardar snapshot en SQLite:', err);
    }
  }

  /**
   * Obtiene la serie histórica de una cotización específica (ej. 'blue', 'mep', 'ccl', 'oficial')
   */
  static getHistory(quoteType: string, limit: number = 30): readonly QuoteHistoryPoint[] {
    const db = DatabaseConnection.getInstance();
    const query = db.prepare(`
      SELECT 
        id,
        quote_type as quoteType,
        name,
        buy_price as buyPrice,
        sell_price as sellPrice,
        spread,
        variation_24h as variation24h,
        recorded_at as recordedAt
      FROM quotes_history
      WHERE quote_type = ?
      ORDER BY recorded_at DESC
      LIMIT ?
    `);

    const rows = query.all(quoteType, limit) as unknown as QuoteHistoryPoint[];
    return rows.reverse();
  }

  /**
   * Obtiene el conteo total de registros históricos guardados
   */
  static getTotalRecordsCount(): number {
    const db = DatabaseConnection.getInstance();
    const result = db.prepare('SELECT COUNT(*) as total FROM quotes_history').get() as { total: number };
    return result?.total || 0;
  }
}
