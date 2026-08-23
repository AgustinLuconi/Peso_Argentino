import { globalCache } from '../../core/cache/MemoryCache';

export interface NewsItemDto {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  impactLevel: 'critico' | 'alto' | 'moderado';
  affectedAssets: string[];
  keyTakeaways: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  leadAnalysis?: string;
  transmissionChannel?: string;
  marketConsensus?: string;
}

export class NewsService {
  private static readonly TTL_MS = 5 * 60 * 1000; // 5 mins

  static async getNewsFeed(): Promise<NewsItemDto[]> {
    return globalCache.getOrSet(
      'news_feed_v1',
      async () => {
        return [
          {
            id: 'news-1',
            title: 'El BCRA profundiza la absorción de liquidez y consolida el ancla de tasas',
            summary: 'La migración hacia LEFIs del Tesoro completó el saneamiento del balance y eliminó la emisión endógena por intereses de pasivos remunerados.',
            source: 'Ámbito Financiero / BCRA',
            publishedAt: 'Hace 25 min',
            impactLevel: 'critico',
            affectedAssets: ['LEFIs', 'Dólar CCL', 'TNA 32%'],
            keyTakeaways: [
              'Cero emisión por pasivos remunerados del Banco Central.',
              'Traspaso ordenado del manejo de liquidez hacia el Tesoro Nacional.',
              'Compresión sostenida de la brecha cambiaria por debajo del 15%.',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'La eliminación de los pasivos remunerados ha neutralizado la emisión endógena, estabilizando la base monetaria en términos reales.',
            transmissionChannel: 'Canal de transmisión: Tasa de política monetaria en 32% TNA impacta en el costo de fondeo y plazos fijos.',
            marketConsensus: 'Consenso: Continuidad en la compresión del riesgo país mientras se sostenga el superávit financiero.',
          },
          {
            id: 'news-2',
            title: 'Las compras de reservas del BCRA en el MULC superan la meta del trimestre',
            summary: 'El superávit comercial energético y agrícola continúa aportando divisas genuinas al mercado oficial de cambios.',
            source: 'El Cronista Comercial',
            publishedAt: 'Hace 1 hora',
            impactLevel: 'alto',
            affectedAssets: ['AL30', 'GD30', 'Reservas USD'],
            keyTakeaways: [
              'Reservas brutas consolidadas sobre los US$ 30.400 millones.',
              'Superávit de balanza comercial acumula US$ 14.500 millones.',
              'Riesgo país perfora los 510 puntos básicos.',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'El flujo de ingreso de divisas de exportaciones fortalece las reservas netas y la solvencia externa del Tesoro.',
            transmissionChannel: 'Incremento de reservas brutas reduce la prima de riesgo de los bonos Globales AL30/GD30.',
            marketConsensus: 'Probabilidad de reingreso al mercado voluntario de crédito en 2025/2026.',
          },
          {
            id: 'news-3',
            title: 'Se formalizan las primeras solicitudes de grandes inversiones bajo el RIGI',
            summary: 'Proyectos de gas licuado en Río Negro y minería de cobre en San Juan ingresaron al comité evaluador ministerial.',
            source: 'Boletín Oficial / Min. Economía',
            publishedAt: 'Hace 3 horas',
            impactLevel: 'alto',
            affectedAssets: ['YPF', 'PAMP', 'TXAR'],
            keyTakeaways: [
              'Inversiones comprometidas superan los US$ 30.000 millones.',
              'Marco de estabilidad tributaria y cambiaria a 30 años.',
              'Impacto directo en exportaciones energéticas a partir de 2027.',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'El régimen de grandes inversiones genera un shock de confianza en la inversión extranjera directa.',
            transmissionChannel: 'Financiamiento privado directo sin recurrir a endeudamiento soberano.',
            marketConsensus: 'Impulso al crecimiento del PBI proyectado y demanda de acciones energéticas en BYMA/NYSE.',
          },
        ];
      },
      NewsService.TTL_MS
    );
  }
}
