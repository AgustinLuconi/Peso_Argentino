import { DatabaseConnection } from '../DatabaseConnection';

export interface MacroSeriesPoint {
  readonly id: number;
  readonly seriesCode: string;
  readonly period: string;
  readonly value: number;
  readonly unit: string;
  readonly source: string;
  readonly updatedAt: string;
}

export class MacroSeriesRepository {
  /**
   * Obtiene la serie histórica de un indicador específico ordenado cronológicamente
   */
  static getSeries(seriesCode: string, limit: number = 100): readonly MacroSeriesPoint[] {
    const db = DatabaseConnection.getInstance();
    const query = db.prepare(`
      SELECT 
        id,
        series_code as seriesCode,
        period,
        value,
        unit,
        source,
        updated_at as updatedAt
      FROM macro_series
      WHERE series_code = ?
      ORDER BY period ASC
      LIMIT ?
    `);

    return query.all(seriesCode, limit) as unknown as MacroSeriesPoint[];
  }

  /**
   * Obtiene todos los códigos de series disponibles en la base de datos
   */
  static getAvailableSeries(): string[] {
    const db = DatabaseConnection.getInstance();
    const rows = db.prepare('SELECT DISTINCT series_code as code FROM macro_series ORDER BY series_code ASC').all() as { code: string }[];
    return rows.map((r) => r.code);
  }
}
