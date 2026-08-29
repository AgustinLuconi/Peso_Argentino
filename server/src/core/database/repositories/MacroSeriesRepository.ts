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
  static async getSeries(
    seriesCode: string,
    limit: number = 100
  ): Promise<readonly MacroSeriesPoint[]> {
    const rows = await DatabaseConnection.query<MacroSeriesPoint>(
      `SELECT 
        id,
        series_code as "seriesCode",
        period,
        value::float as value,
        unit,
        source,
        updated_at as "updatedAt"
      FROM macro_series
      WHERE series_code = $1
      ORDER BY period ASC
      LIMIT $2`,
      [seriesCode, limit]
    );

    return rows;
  }

  /**
   * Obtiene todos los códigos de series disponibles en la base de datos
   */
  static async getAvailableSeries(): Promise<readonly string[]> {
    const rows = await DatabaseConnection.query<{ code: string }>(
      'SELECT DISTINCT series_code as code FROM macro_series ORDER BY series_code ASC'
    );
    return rows.map((r) => r.code);
  }
}
