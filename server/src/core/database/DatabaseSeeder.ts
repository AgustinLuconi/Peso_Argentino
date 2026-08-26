import { DatabaseConnection } from './DatabaseConnection';
import { QuotesHistoryRepository } from './repositories/QuotesHistoryRepository';
import { AiNewsArchiveRepository } from './repositories/AiNewsArchiveRepository';
import { HttpClient } from '../http/HttpClient';

export class DatabaseSeeder {
  /**
   * Ejecuta el sembrado inicial y poblado de datos si la base está vacía o se solicita recarga
   */
  static async seedAll(force: boolean = false): Promise<{
    quotesInserted: number;
    macroSeriesInserted: number;
    ratesInserted: number;
    newsInserted: number;
  }> {
    const db = DatabaseConnection.getInstance();
    const existingQuotes = QuotesHistoryRepository.getTotalRecordsCount();

    if (!force && existingQuotes > 50) {
      console.log(`[DatabaseSeeder] Base de datos ya cuenta con ${existingQuotes} registros. Omitiendo seed forzado.`);
      return {
        quotesInserted: 0,
        macroSeriesInserted: 0,
        ratesInserted: 0,
        newsInserted: 0,
      };
    }

    console.log('[DatabaseSeeder] 🌱 Iniciando poblado integral de la base de datos SQLite...');

    let quotesCount = 0;
    let macroCount = 0;
    let ratesCount = 0;
    let newsCount = 0;

    // 1. Poblado de Histórico de Cotizaciones de Dólar (Últimos 30 días)
    const quoteTypes = [
      { type: 'oficial', name: 'Dólar Oficial (BNA)', baseSell: 1520, baseBuy: 1480 },
      { type: 'blue', name: 'Dólar Libre / Blue', baseSell: 1560, baseBuy: 1540 },
      { type: 'mep', name: 'Dólar MEP (Bolsa AL30)', baseSell: 1545, baseBuy: 1543 },
      { type: 'ccl', name: 'Contado con Liquidación (CCL)', baseSell: 1589, baseBuy: 1585 },
      { type: 'tarjeta', name: 'Dólar Tarjeta / Turista', baseSell: 1976, baseBuy: 1924 },
      { type: 'cripto', name: 'Dólar Cripto (USDT/ARS)', baseSell: 1568, baseBuy: 1565 },
      { type: 'mayorista', name: 'Dólar Mayorista (A3500)', baseSell: 1502, baseBuy: 1500 },
    ];

    const insertQuoteStmt = db.prepare(`
      INSERT INTO quotes_history (quote_type, name, buy_price, sell_price, spread, variation_24h, recorded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    db.exec('BEGIN TRANSACTION;');
    try {
      const now = new Date();
      for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
        const date = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().replace('T', ' ').slice(0, 19);

        for (const q of quoteTypes) {
          // Generar fluctuación histórica coherente con la convergencia monetaria
          const varianceFactor = 1 - (dayOffset * 0.003) + (Math.sin(dayOffset) * 0.004);
          const sell = Number((q.baseSell * varianceFactor).toFixed(2));
          const buy = Number((q.baseBuy * varianceFactor).toFixed(2));
          const spread = Number((sell - buy).toFixed(2));
          const var24h = Number((Math.sin(dayOffset * 1.5) * 0.8).toFixed(2));

          insertQuoteStmt.run(q.type, q.name, buy, sell, spread, var24h, dateStr);
          quotesCount++;
        }
      }
      db.exec('COMMIT;');
    } catch (e) {
      db.exec('ROLLBACK;');
      console.error('[DatabaseSeeder] Error poblando quotes_history:', e);
    }

    // 2. Poblado de Series Macroeconómicas (IPC, Reservas, Base Monetaria, Balanza)
    const insertMacroStmt = db.prepare(`
      INSERT OR REPLACE INTO macro_series (series_code, period, value, unit, source, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'))
    `);

    const macroSeriesData = [
      // IPC INDEC
      { code: 'ipc', period: '2025-09', value: 3.5, unit: '%', source: 'INDEC' },
      { code: 'ipc', period: '2025-10', value: 2.7, unit: '%', source: 'INDEC' },
      { code: 'ipc', period: '2025-11', value: 2.4, unit: '%', source: 'INDEC' },
      { code: 'ipc', period: '2025-12', value: 2.7, unit: '%', source: 'INDEC' },
      { code: 'ipc', period: '2026-01', value: 2.3, unit: '%', source: 'INDEC' },
      { code: 'ipc', period: '2026-02', value: 2.1, unit: '%', source: 'INDEC' },
      { code: 'ipc', period: '2026-03', value: 2.5, unit: '%', source: 'INDEC' },
      { code: 'ipc', period: '2026-04', value: 2.2, unit: '%', source: 'INDEC' },
      { code: 'ipc', period: '2026-05', value: 1.9, unit: '%', source: 'INDEC' },
      { code: 'ipc', period: '2026-06', value: 1.8, unit: '%', source: 'INDEC' },
      { code: 'ipc', period: '2026-07', value: 2.1, unit: '%', source: 'INDEC' },
      // Reservas BCRA (USD Millones)
      { code: 'reservas', period: '2026-01', value: 28450, unit: 'USD M', source: 'BCRA' },
      { code: 'reservas', period: '2026-03', value: 29120, unit: 'USD M', source: 'BCRA' },
      { code: 'reservas', period: '2026-05', value: 29890, unit: 'USD M', source: 'BCRA' },
      { code: 'reservas', period: '2026-07', value: 30412, unit: 'USD M', source: 'BCRA' },
      // Base Monetaria (Miles de millones ARS)
      { code: 'base_monetaria', period: '2026-01', value: 21500, unit: 'ARS B', source: 'BCRA' },
      { code: 'base_monetaria', period: '2026-04', value: 23200, unit: 'ARS B', source: 'BCRA' },
      { code: 'base_monetaria', period: '2026-07', value: 24850, unit: 'ARS B', source: 'BCRA' },
    ];

    db.exec('BEGIN TRANSACTION;');
    try {
      for (const m of macroSeriesData) {
        insertMacroStmt.run(m.code, m.period, m.value, m.unit, m.source);
        macroCount++;
      }
      db.exec('COMMIT;');
    } catch (e) {
      db.exec('ROLLBACK;');
      console.error('[DatabaseSeeder] Error poblando macro_series:', e);
    }

    // 3. Poblado de Tasas Bancarias de Plazo Fijo & Billeteras
    const insertRateStmt = db.prepare(`
      INSERT OR REPLACE INTO bank_rates (entity_name, rate_type, tna, tea, tem, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'))
    `);

    const bankRatesData = [
      { name: 'BANCO DE LA NACION ARGENTINA', type: 'plazo_fijo', tna: 19.0, tea: 20.75, tem: 1.56 },
      { name: 'BANCO SANTANDER ARGENTINA S.A.', type: 'plazo_fijo', tna: 20.0, tea: 21.94, tem: 1.64 },
      { name: 'BANCO DE GALICIA Y BUENOS AIRES S.A.U.', type: 'plazo_fijo', tna: 21.0, tea: 23.14, tem: 1.73 },
      { name: 'BBVA ARGENTINA S.A.', type: 'plazo_fijo', tna: 20.5, tea: 22.54, tem: 1.68 },
      { name: 'BANCO MACRO S.A.', type: 'plazo_fijo', tna: 22.0, tea: 24.36, tem: 1.81 },
      { name: 'BANCO PROVINCIA DE BUENOS AIRES', type: 'plazo_fijo', tna: 20.0, tea: 21.94, tem: 1.64 },
      { name: 'BANCO CREDICOOP COOPERATIVO LIMITADO', type: 'plazo_fijo', tna: 20.0, tea: 21.94, tem: 1.64 },
      { name: 'BANCO ICBC ARGENTINA', type: 'plazo_fijo', tna: 21.5, tea: 23.75, tem: 1.77 },
      { name: 'BANCO CIUDAD DE BUENOS AIRES', type: 'plazo_fijo', tna: 19.5, tea: 21.34, tem: 1.60 },
      { name: 'NARANJA X (Billetera)', type: 'billetera', tna: 24.0, tea: 26.82, tem: 1.97 },
      { name: 'MERCADO PAGO (Billetera)', type: 'billetera', tna: 19.8, tea: 21.70, tem: 1.63 },
      { name: 'PERSONAL PAY (Billetera)', type: 'billetera', tna: 22.5, tea: 24.97, tem: 1.85 },
      { name: 'UALA (Billetera)', type: 'billetera', tna: 23.0, tea: 25.58, tem: 1.89 },
    ];

    db.exec('BEGIN TRANSACTION;');
    try {
      for (const r of bankRatesData) {
        insertRateStmt.run(r.name, r.type, r.tna, r.tea, r.tem);
        ratesCount++;
      }
      db.exec('COMMIT;');
    } catch (e) {
      db.exec('ROLLBACK;');
      console.error('[DatabaseSeeder] Error poblando bank_rates:', e);
    }

    // 4. Poblado de Archivo Inicial de Noticias Inteligentes Pre-Clasificadas
    const initialNews = [
      {
        title: 'El BCRA acumuló US$ 180 millones en el MULC y las reservas superan los US$ 30.400M',
        summary: 'La autoridad monetaria sostuvo su racha compradora favorecida por la liquidación de energía y cosecha gruesa.',
        source: 'Ámbito Financiero',
        sentiment: 'bullish' as const,
        impactLevel: 'alto' as const,
        affectedAssets: ['Reservas BCRA', 'Dólar MEP', 'AL30', 'GD30'],
        transmissionChannel: 'Compras netas de divisas refuerzan la solvencia de pago externa y comprimen el riesgo país.',
        marketConsensus: 'Consenso de analistas: Continuidad en la acumulación de divisas y estabilidad de la brecha cambiaría.',
        executiveSummary: 'Compras sostenidas del BCRA fortalecen el balance externo y reducen el spread de bonos soberanos.',
        confidenceScore: 0.96,
        provider: 'gemini-3.5-flash-lite',
      },
      {
        title: 'YPF y Petronas ratifican la planta de GNL en Río Negro bajo el régimen del RIGI',
        summary: 'Inversión inicial estimada en US$ 22.000 millones para la licuefacción de gas de Vaca Muerta.',
        source: 'El Cronista',
        sentiment: 'bullish' as const,
        impactLevel: 'critico' as const,
        affectedAssets: ['YPF', 'PAMP', 'ADRs', 'Bonos Corporativos'],
        transmissionChannel: 'Ingreso proyectado de divisas por inversión extranjera directa con garantía de estabilidad cambiaria.',
        marketConsensus: 'Fuerte atractivo para acciones energéticas locales y cambio estructural en la balanza comercial.',
        executiveSummary: 'Mega inversión de GNL anclada en el RIGI asegura un horizonte exportador de alta envergadura.',
        confidenceScore: 0.98,
        provider: 'gemini-3.5-flash-lite',
      },
      {
        title: 'El Tesoro Nacional cerró con superávit financiero por séptimo mes consecutivo',
        summary: 'El superávit financiero acumulado superó los $518.000 millones consolidando el ancla fiscal.',
        source: 'Ministerio de Economía',
        sentiment: 'bullish' as const,
        impactLevel: 'critico' as const,
        affectedAssets: ['Lecaps', 'Bono AL30', 'S&P Merval', 'Tasa LEFI'],
        transmissionChannel: 'La eliminación del déficit fiscal anula la necesidad de emisión para financiar al Tesoro.',
        marketConsensus: 'Disciplina fiscal innegociable apuntala la compresión de tasas y la baja del riesgo soberano.',
        executiveSummary: 'Ancla fiscal estricta sostiene la estabilidad macroeconómica y el sendero desinflacionario.',
        confidenceScore: 0.97,
        provider: 'gemini-3.5-flash-lite',
      },
    ];

    for (const n of initialNews) {
      AiNewsArchiveRepository.saveClassification(
        { title: n.title, summary: n.summary, source: n.source },
        {
          sentiment: n.sentiment,
          impactLevel: n.impactLevel,
          affectedAssets: n.affectedAssets,
          transmissionChannel: n.transmissionChannel,
          marketConsensus: n.marketConsensus,
          executiveSummary: n.executiveSummary,
          confidenceScore: n.confidenceScore,
          provider: n.provider,
        }
      );
      newsCount++;
    }

    console.log(
      `[DatabaseSeeder] ✅ Base de datos SQLite poblada exitosamente: ${quotesCount} cotizaciones, ${macroCount} series macro, ${ratesCount} tasas bancarias, ${newsCount} noticias analizadas.`
    );

    return {
      quotesInserted: quotesCount,
      macroSeriesInserted: macroCount,
      ratesInserted: ratesCount,
      newsInserted: newsCount,
    };
  }
}
