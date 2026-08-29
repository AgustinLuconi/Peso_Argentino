import { DatabaseConnection } from './DatabaseConnection';

export class DatabaseMigrations {
  /**
   * Ejecuta las migraciones de esquema iniciales y crea las tablas e índices en Neon PostgreSQL
   */
  static async runMigrations(): Promise<void> {
    if (!DatabaseConnection.isConfigured()) {
      console.log('[Database] ℹ️ Migraciones omitidas: DATABASE_URL de Neon no configurada.');
      return;
    }

    console.log('[Database] 🚀 Ejecutando migraciones de tablas e índices en Neon PostgreSQL...');

    try {
      // 1. Histórico de cotizaciones de Dólar
      await DatabaseConnection.execute(`
        CREATE TABLE IF NOT EXISTS quotes_history (
          id SERIAL PRIMARY KEY,
          quote_type VARCHAR(50) NOT NULL,
          name VARCHAR(100) NOT NULL,
          buy_price NUMERIC(14, 2) NOT NULL,
          sell_price NUMERIC(14, 2) NOT NULL,
          spread NUMERIC(14, 2) DEFAULT 0,
          variation_24h NUMERIC(10, 4) DEFAULT 0,
          recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await DatabaseConnection.execute(`
        CREATE INDEX IF NOT EXISTS idx_quotes_type_date ON quotes_history (quote_type, recorded_at);
      `);

      // 2. Series Macroeconómicas
      await DatabaseConnection.execute(`
        CREATE TABLE IF NOT EXISTS macro_series (
          id SERIAL PRIMARY KEY,
          series_code VARCHAR(50) NOT NULL,
          period VARCHAR(20) NOT NULL,
          value NUMERIC(18, 4) NOT NULL,
          unit VARCHAR(50) NOT NULL,
          source VARCHAR(100) NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          CONSTRAINT uq_macro_series UNIQUE(series_code, period)
        );
      `);

      await DatabaseConnection.execute(`
        CREATE INDEX IF NOT EXISTS idx_macro_series_code ON macro_series (series_code);
      `);

      // 3. Archivo Permanente de Noticias & Clasificaciones IA
      await DatabaseConnection.execute(`
        CREATE TABLE IF NOT EXISTS ai_news_archive (
          id SERIAL PRIMARY KEY,
          title_hash VARCHAR(64) UNIQUE NOT NULL,
          title TEXT NOT NULL,
          summary TEXT NOT NULL,
          source VARCHAR(100),
          sentiment VARCHAR(50) NOT NULL,
          impact_level VARCHAR(50) NOT NULL,
          affected_assets_json TEXT NOT NULL DEFAULT '[]',
          transmission_channel TEXT NOT NULL,
          market_consensus TEXT NOT NULL,
          executive_summary TEXT NOT NULL,
          confidence_score NUMERIC(5, 4) NOT NULL,
          ai_provider VARCHAR(100) NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await DatabaseConnection.execute(`
        CREATE INDEX IF NOT EXISTS idx_ai_news_sentiment ON ai_news_archive (sentiment);
      `);

      await DatabaseConnection.execute(`
        CREATE INDEX IF NOT EXISTS idx_ai_news_created ON ai_news_archive (created_at);
      `);

      // 4. Tasas de Interés Bancarias y Billeteras Virtuales
      await DatabaseConnection.execute(`
        CREATE TABLE IF NOT EXISTS bank_rates (
          id SERIAL PRIMARY KEY,
          entity_name VARCHAR(150) NOT NULL,
          rate_type VARCHAR(50) NOT NULL,
          tna NUMERIC(10, 4) NOT NULL,
          tea NUMERIC(10, 4) DEFAULT 0,
          tem NUMERIC(10, 4) DEFAULT 0,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          CONSTRAINT uq_bank_rates UNIQUE(entity_name, rate_type)
        );
      `);

      // 5. Simulaciones Financieras y Parámetros de Usuario
      await DatabaseConnection.execute(`
        CREATE TABLE IF NOT EXISTS user_simulations (
          id SERIAL PRIMARY KEY,
          simulation_type VARCHAR(50) NOT NULL,
          title VARCHAR(200) NOT NULL,
          input_params_json TEXT NOT NULL DEFAULT '{}',
          result_data_json TEXT NOT NULL DEFAULT '{}',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      // 6. Suscriptores al Newsletter "Briefing Financiero"
      await DatabaseConnection.execute(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          frequency VARCHAR(50) NOT NULL DEFAULT 'daily',
          include_breaking_alerts BOOLEAN NOT NULL DEFAULT true,
          topics_json TEXT NOT NULL DEFAULT '["all"]',
          status VARCHAR(20) NOT NULL DEFAULT 'active',
          source VARCHAR(100) NOT NULL DEFAULT 'web_portal',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await DatabaseConnection.execute(`
        CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers (email);
      `);

      await DatabaseConnection.execute(`
        CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers (status);
      `);

      console.log('[Database] ✅ Migraciones en Neon PostgreSQL completadas exitosamente.');
    } catch (err) {
      console.error('[Database] ❌ Error durante migraciones en Neon:', err);
      throw err;
    }
  }
}

// Ejecutar directamente si se llama via CLI (`tsx DatabaseMigrations.ts`)
if (process.argv[1]?.endsWith('DatabaseMigrations.ts')) {
  DatabaseMigrations.runMigrations().then(() => {
    DatabaseConnection.close();
  });
}
