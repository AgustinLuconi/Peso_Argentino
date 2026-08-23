import { DolarService } from '../modules/dolar/DolarService';
import { MacroService } from '../modules/macro/MacroService';
import { RatesService } from '../modules/rates/RatesService';
import { MarketsService } from '../modules/markets/MarketsService';
import { PoliticalService } from '../modules/political/PoliticalService';
import { NewsService } from '../modules/news/NewsService';

export class SyncWorker {
  private static timer30s: NodeJS.Timeout | null = null;
  private static timer15m: NodeJS.Timeout | null = null;

  static async warmUpAll() {
    console.log('[SyncWorker] 🔄 Pre-calentando caché del servidor con APIs gratuitas...');
    const start = Date.now();
    try {
      await Promise.allSettled([
        DolarService.getQuotes(),
        MacroService.getOverview(),
        RatesService.getPlazosFijos(),
        RatesService.getWallets(),
        MarketsService.getMarketOverview(),
        PoliticalService.getOverview(),
        NewsService.getNewsFeed(),
      ]);
      console.log(`[SyncWorker] ✅ Caché pre-calentado con éxito en ${Date.now() - start}ms`);
    } catch (e) {
      console.warn('[SyncWorker] Error durante el pre-calentamiento:', e);
    }
  }

  static start() {
    this.warmUpAll();

    // 1. Dólar Spot: cada 30 segundos
    this.timer30s = setInterval(async () => {
      try {
        await DolarService.getQuotes();
      } catch (e) {
        console.warn('[SyncWorker] Error auto-refrescando dólar:', e);
      }
    }, 30 * 1000);

    // 2. Macro & Tasas: cada 15 minutos
    this.timer15m = setInterval(async () => {
      try {
        await Promise.allSettled([
          MacroService.getOverview(),
          RatesService.getPlazosFijos(),
          RatesService.getWallets(),
        ]);
      } catch (e) {
        console.warn('[SyncWorker] Error auto-refrescando macro/tasas:', e);
      }
    }, 15 * 60 * 1000);
  }

  static stop() {
    if (this.timer30s) clearInterval(this.timer30s);
    if (this.timer15m) clearInterval(this.timer15m);
  }
}
