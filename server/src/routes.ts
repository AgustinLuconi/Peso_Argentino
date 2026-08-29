import { Router, Request, Response } from 'express';
import { DolarService } from './modules/dolar/DolarService';
import { MacroService } from './modules/macro/MacroService';
import { RatesService } from './modules/rates/RatesService';
import { MarketsService } from './modules/markets/MarketsService';
import { BondDetailService } from './modules/bonds/BondDetailService';
import { PoliticalService } from './modules/political/PoliticalService';
import { NewsService } from './modules/news/NewsService';
import { LlmService } from './modules/llm/application/LlmService';
import { NewsletterService } from './modules/newsletter/NewsletterService';
import { globalCache } from './core/cache/MemoryCache';
import { globalApiRateLimiter, llmApiRateLimiter } from './core/middleware/RateLimiter';
import { QuotesHistoryRepository } from './core/database/repositories/QuotesHistoryRepository';
import { AiNewsArchiveRepository } from './core/database/repositories/AiNewsArchiveRepository';
import { MacroSeriesRepository } from './core/database/repositories/MacroSeriesRepository';
import { DatabaseConnection } from './core/database/DatabaseConnection';

export const v1Router = Router();

/**
 * Función auxiliar para extraer mensajes de error de forma segura (sin tipo any)
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Error interno no especificado';
}

// Apply global rate limiting to all standard v1 endpoints (120 req/min)
v1Router.use(globalApiRateLimiter);

// Health Check & Cache Telemetry
v1Router.get('/health', async (_req: Request, res: Response) => {
  try {
    const [totalQuotes, totalNews, llmStatus] = await Promise.all([
      QuotesHistoryRepository.getTotalRecordsCount(),
      AiNewsArchiveRepository.getArchiveCount(),
      LlmService.getEngineStatus(),
    ]);

    res.json({
      status: 'ok',
      service: 'Peso Argentino Core API v1',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      cache: globalCache.getStats(),
      database: {
        engine: DatabaseConnection.getEngineName(),
        configured: DatabaseConnection.isConfigured(),
        totalQuoteRecords: totalQuotes,
        totalClassifiedNews: totalNews,
      },
      llm: llmStatus,
      rateLimiting: {
        globalLimit: '120 req/min',
        llmLimit: '15 req/min',
      },
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// 1. Dashboard Metrics (Unified Endpoint)
v1Router.get('/dashboard/metrics', async (_req: Request, res: Response) => {
  try {
    const [quotes, macro] = await Promise.all([
      DolarService.getQuotes(),
      MacroService.getOverview(),
    ]);

    const oficial = quotes.find((q) => q.type === 'oficial');
    const ccl = quotes.find((q) => q.type === 'ccl');
    let dynamicBreach = 14.08;
    if (oficial && ccl && oficial.sellPrice > 0) {
      dynamicBreach = Number((((ccl.sellPrice - oficial.sellPrice) / oficial.sellPrice) * 100).toFixed(2));
    }

    res.json({
      success: true,
      data: {
        quotes,
        riesgoPais: macro.riesgoPais,
        inflation: macro.inflation,
        contracts: macro.contracts,
        monetary: macro.monetary,
        dynamicBreachPercent: dynamicBreach,
        lastUpdated: new Date().toLocaleTimeString('es-AR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      },
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// 2. Dólar Spot & Histórico Persistente en Neon PostgreSQL
v1Router.get('/dolar/quotes', async (_req: Request, res: Response) => {
  try {
    const data = await DolarService.getQuotes();
    res.json({ success: true, count: data.length, data });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

v1Router.get('/dolar/history/:type', async (req: Request, res: Response) => {
  try {
    const type = req.params.type || 'blue';
    const limit = Number(req.query.limit) || 30;
    const timeframe = req.query.timeframe as string | undefined;
    const history = await DolarService.getHistory(type, limit, timeframe);
    res.json({ success: true, count: history.length, quoteType: type, timeframe: timeframe || 'custom', data: history });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// 3. Macro Indicadores & Series Históricas
v1Router.get('/macro/overview', async (_req: Request, res: Response) => {
  try {
    const data = await MacroService.getOverview();
    res.json({ success: true, data });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

v1Router.get('/macro/series', async (_req: Request, res: Response) => {
  try {
    const series = await MacroSeriesRepository.getAvailableSeries();
    res.json({ success: true, count: series.length, data: series });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

v1Router.get('/macro/series/:code', async (req: Request, res: Response) => {
  try {
    const code = req.params.code;
    const limit = Number(req.query.limit) || 120;
    const series = await MacroSeriesRepository.getSeries(code, limit);
    res.json({ success: true, count: series.length, seriesCode: code, data: series });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// 4. Tasas de Interés
v1Router.get('/rates/plazos-fijos', async (_req: Request, res: Response) => {
  try {
    const data = await RatesService.getPlazosFijos();
    res.json({ success: true, count: data.length, data });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

v1Router.get('/rates/wallets', async (_req: Request, res: Response) => {
  try {
    const data = await RatesService.getWallets();
    res.json({ success: true, count: data.length, data });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// 5. Mercado de Capitales & Análisis
v1Router.get('/markets/assets', async (_req: Request, res: Response) => {
  try {
    const data = await MarketsService.getMarketOverview();
    res.json({ success: true, data });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

v1Router.get('/markets/analysis/:ticker', async (req: Request, res: Response) => {
  try {
    const ticker = req.params.ticker || 'GGAL';
    const analysis = await MarketsService.getAssetAnalysis(ticker);
    res.json({ success: true, data: analysis });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// 6. Detalle de Bonos (AL30 / GD30)
v1Router.get('/bonds/:ticker', async (req: Request, res: Response) => {
  try {
    const ticker = req.params.ticker || 'AL30';
    const data = await BondDetailService.getBondDetail(ticker);
    res.json({ success: true, data });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// 7. Político & RIGI
v1Router.get('/political/overview', async (_req: Request, res: Response) => {
  try {
    const data = await PoliticalService.getOverview();
    res.json({ success: true, data });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// 8. Intelligence & Noticias (Edición Diaria en Memoria RAM)
v1Router.get('/news/feed', async (_req: Request, res: Response) => {
  try {
    const feed = await NewsService.getNewsFeed();
    res.json({
      success: true,
      editionDate: feed.editionDate,
      editionFormatted: feed.editionFormatted,
      totalNews: feed.totalNews,
      nationalCount: feed.nationalCount,
      internationalCount: feed.internationalCount,
      data: feed.news,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// 9. Inteligencia Artificial (LLM / NLP) con Rate Limiting Estricto (15 req/min)
v1Router.get('/llm/status', async (_req: Request, res: Response) => {
  try {
    const status = await LlmService.getEngineStatus();
    res.json({ success: true, data: status });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

v1Router.post('/llm/classify', llmApiRateLimiter, async (req: Request, res: Response) => {
  try {
    const { title, summary, source } = req.body || {};
    if (!title) {
      return res.status(400).json({ success: false, error: 'Título requerido para clasificación' });
    }
    const result = await LlmService.classify({ title, summary: summary || '', source });
    res.json({ success: true, data: result });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

v1Router.post('/llm/chat', llmApiRateLimiter, async (req: Request, res: Response) => {
  try {
    const { messages, macroContext } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: 'Array de mensajes requerido' });
    }
    const response = await LlmService.chat(messages, macroContext);
    res.json({ success: true, data: response });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// 10. Telemetría de Base de Datos Neon PostgreSQL
v1Router.get('/database/stats', async (_req: Request, res: Response) => {
  try {
    const [quotesHistoryCount, aiNewsArchiveCount] = await Promise.all([
      QuotesHistoryRepository.getTotalRecordsCount(),
      AiNewsArchiveRepository.getArchiveCount(),
    ]);

    res.json({
      success: true,
      data: {
        engine: DatabaseConnection.getEngineName(),
        configured: DatabaseConnection.isConfigured(),
        quotesHistoryCount,
        aiNewsArchiveCount,
      },
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// 11. Newsletter Institucional "Briefing Financiero"
v1Router.post('/newsletter/subscribe', async (req: Request, res: Response) => {
  try {
    const { email, frequency, includeBreakingAlerts, topics, source } = req.body || {};
    const result = await NewsletterService.subscribe({
      email,
      frequency,
      includeBreakingAlerts,
      topics,
      source,
    });
    res.json(result);
  } catch (error: unknown) {
    res.status(500).json({ success: false, message: getErrorMessage(error) });
  }
});

v1Router.post('/newsletter/unsubscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body || {};
    const result = await NewsletterService.unsubscribe(email);
    res.json(result);
  } catch (error: unknown) {
    res.status(500).json({ success: false, message: getErrorMessage(error) });
  }
});

v1Router.get('/newsletter/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await NewsletterService.getStats();
    res.json({ success: true, data: stats });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

v1Router.get('/newsletter/sample-preview', (_req: Request, res: Response) => {
  try {
    const preview = NewsletterService.getSamplePreview();
    res.json({ success: true, data: preview });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

