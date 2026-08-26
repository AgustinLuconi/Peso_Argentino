import { DatabaseConnection } from './DatabaseConnection';

export class DatabaseMigrations {
  /**
   * Ejecuta las migraciones de esquema iniciales y crea las tablas e índices necesarios
   */
  static runMigrations(): void {
    const db = DatabaseConnection.getInstance();

    console.log('[Database] 🚀 Ejecutando migraciones de tablas e índices...');

    db.exec(`
      -- 1. Histórico de cotizaciones de Dólar (Oficial, Blue, MEP, CCL, Cripto, etc.)
      CREATE TABLE IF NOT EXISTS quotes_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quote_type TEXT NOT NULL,
        name TEXT NOT NULL,
        buy_price REAL NOT NULL,
        sell_price REAL NOT NULL,
        spread REAL DEFAULT 0,
        variation_24h REAL DEFAULT 0,
        recorded_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      );

      CREATE INDEX IF NOT EXISTS idx_quotes_type_date ON quotes_history (quote_type, recorded_at);

      -- 2. Series Macroeconómicas (IPC INDEC, Reservas BCRA, Base Monetaria, Balanza Comercial)
      CREATE TABLE IF NOT EXISTS macro_series (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        series_code TEXT NOT NULL,
        period TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT NOT NULL,
        source TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        UNIQUE(series_code, period)
      );

      CREATE INDEX IF NOT EXISTS idx_macro_series_code ON macro_series (series_code);

      -- 3. Archivo Permanente de Noticias & Clasificaciones IA (Evita re-computar con Gemini)
      CREATE TABLE IF NOT EXISTS ai_news_archive (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title_hash TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        source TEXT,
        sentiment TEXT NOT NULL,
        impact_level TEXT NOT NULL,
        affected_assets_json TEXT NOT NULL,
        transmission_channel TEXT NOT NULL,
        market_consensus TEXT NOT NULL,
        executive_summary TEXT NOT NULL,
        confidence_score REAL NOT NULL,
        ai_provider TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      );

      CREATE INDEX IF NOT EXISTS idx_ai_news_sentiment ON ai_news_archive (sentiment);
      CREATE INDEX IF NOT EXISTS idx_ai_news_created ON ai_news_archive (created_at);

      -- 4. Tasas de Interés Bancarias y Billeteras Virtuales
      CREATE TABLE IF NOT EXISTS bank_rates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_name TEXT NOT NULL,
        rate_type TEXT NOT NULL, -- 'plazo_fijo', 'billetera', 'lefi'
        tna REAL NOT NULL,
        tea REAL DEFAULT 0,
        tem REAL DEFAULT 0,
        updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        UNIQUE(entity_name, rate_type)
      );

      -- 5. Simulaciones Financieras y Parámetros de Usuario (Carry Trade, Bonos AL30/GD30)
      CREATE TABLE IF NOT EXISTS user_simulations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        simulation_type TEXT NOT NULL,
        title TEXT NOT NULL,
        input_params_json TEXT NOT NULL,
        result_data_json TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      );
    `);

    console.log('[Database] ✅ Migraciones completadas exitosamente.');
  }
}
