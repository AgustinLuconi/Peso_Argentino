import {
  NewsRepositoryPort,
  NewsIntelligenceDto,
} from '../application/NewsRepositoryPort';
import {
  IntelligenceNews,
  NewsCategory,
  ImpactLevel,
} from '../domain/IntelligenceNews';

export class MockNewsRepository implements NewsRepositoryPort {
  async getNews(
    category?: NewsCategory,
    impact?: ImpactLevel
  ): Promise<NewsIntelligenceDto> {
    const allNews: IntelligenceNews[] = [
      new IntelligenceNews({
        id: 'news-1',
        title:
          'El BCRA supera compras netas por US$ 19.500 M en el MULC y consolida reservas brutas sobre los US$ 30.400 M',
        category: 'bcra',
        impactLevel: 'critico',
        source: 'Comunicado Oficial BCRA & Ministerio de Economía',
        publishedAt: 'Hace 35 minutos',
        summary:
          'La autoridad monetaria cerró otra rueda con saldo comprador neto en el mercado de cambios, impulsada por las liquidaciones del agro y el sector energético. La recomposición de reservas fortalece el balance y acerca la normalización del esquema cambiario.',
        keyTakeaways: [
          'Compras netas diarias de US$ 145 millones en el MULC.',
          'Reservas netas consolidadas en terreno positivo tras el saneamiento de pasivos.',
          'Continúa la esterilización de emisión mediante superávit primario del Tesoro.',
        ],
        affectedAssets: ['USD Oficial', 'Dólar MEP', 'AL30D', 'GD30D'],
        marketSentiment: 'bullish',
        readTimeMinutes: 3,
      }),
      new IntelligenceNews({
        id: 'news-2',
        title:
          'INDEC: El IPC se ubicó en 2,2% mensual y marca el menor registro en más de 4 años',
        category: 'macro',
        impactLevel: 'critico',
        source: 'Instituto Nacional de Estadística y Censos (INDEC)',
        publishedAt: 'Hace 2 horas',
        summary:
          'La variación interanual continúa desacelerándose fuertemente. Los precios regulados y la canasta de alimentos reflejan el efecto ancla del equilibrio fiscal y la emisión monetaria cero para financiamiento del Tesoro.',
        keyTakeaways: [
          'Alimentos y bebidas avanzaron por debajo del promedio general.',
          'Inflación núcleo se consolidó en 2,1% mensual.',
          'Analistas del REM proyectan convergencia hacia el 1,8% para el próximo trimestre.',
        ],
        affectedAssets: ['Lecaps', 'Boncer TX26', 'S&P Merval', 'USD Blue'],
        marketSentiment: 'bullish',
        readTimeMinutes: 4,
      }),
      new IntelligenceNews({
        id: 'news-3',
        title:
          'Régimen RIGI: Proyectos de inversión formalmente presentados superan los US$ 50.000 millones',
        category: 'energia',
        impactLevel: 'alto',
        source: 'Secretaría de Coordinación de Energía y Minería',
        publishedAt: 'Hace 4 horas',
        summary:
          'Compañías internacionales y consorcios locales avanzan en la presentación formal bajo el marco de la Ley 27.742 para proyectos de GNL en Río Negro y mega-yacimientos de cobre en San Juan y Salta.',
        keyTakeaways: [
          'Proyecto de planta flotante y terminal de GNL lidera con US$ 30.000 M.',
          'Proyectos de cobre Los Azules y Josemaría avanzan en adhesión provincial.',
          'Seguridad jurídica por 30 años y acceso progresivo al mercado de cambios.',
        ],
        affectedAssets: ['YPF', 'PAMP', 'VIST', 'CEPU'],
        marketSentiment: 'bullish',
        readTimeMinutes: 5,
      }),
      new IntelligenceNews({
        id: 'news-4',
        title:
          'Riesgo País comprime hasta los 738 puntos básicos ante la sostenida demanda de bonos globales',
        category: 'deuda',
        impactLevel: 'alto',
        source: 'JP Morgan EMBI+ & BYMA',
        publishedAt: 'Hace 6 horas',
        summary:
          'La curva soberana en dólares registró alzas generalizadas con paridades del GD30 superando el 68%. Fondos institucionales ponderan positivamente el ancla del superávit financiero ininterrumpido.',
        keyTakeaways: [
          'AL30 y GD30 lideran el volumen operado en BYMA y Wall Street.',
          'La compresión de rendimientos ubica la TIR soberana en torno al 13,5% - 14,2%.',
          'Mejora en la perspectiva de crédito soberano por calificadoras internacionales.',
        ],
        affectedAssets: ['GD30', 'AL30', 'GD35', 'GGAL'],
        marketSentiment: 'bullish',
        readTimeMinutes: 3,
      }),
      new IntelligenceNews({
        id: 'news-5',
        title:
          'El Tesoro licitó Lecaps y Bonos vinculados a tasa con extensión de plazos y fuerte rollover',
        category: 'deuda',
        impactLevel: 'moderado',
        source: 'Secretaría de Finanzas de la Nación',
        publishedAt: 'Ayer',
        summary:
          'En la última colocación quincenal, Finanzas capturó financiamiento genuino con tasas mensuales en torno al 3,4% - 3,6% TNA, absorbiendo liquidez del sistema bancario sin emisión monetaria.',
        keyTakeaways: [
          'Rollover superior al 120% sobre los vencimientos de la quincena.',
          'Migración de liquidez de bancos hacia instrumentos del Tesoro nacional.',
          'Aplanamiento de la curva de rendimientos en moneda local.',
        ],
        affectedAssets: ['S18O5', 'S28N5', 'Bopreal Serie 1'],
        marketSentiment: 'neutral',
        readTimeMinutes: 3,
      }),
    ];

    let filtered = allNews;
    if (category) {
      filtered = filtered.filter((n) => n.category === category);
    }
    if (impact) {
      filtered = filtered.filter((n) => n.impactLevel === impact);
    }

    const breakingNews = allNews.find((n) => n.impactLevel === 'critico') || null;

    const topAffectedAssets = [
      { ticker: 'AL30D', mentionsCount: 14, trend: 'up' as const },
      { ticker: 'GD30D', mentionsCount: 12, trend: 'up' as const },
      { ticker: 'USD CCL', mentionsCount: 11, trend: 'down' as const },
      { ticker: 'YPFD', mentionsCount: 9, trend: 'up' as const },
      { ticker: 'GGAL', mentionsCount: 8, trend: 'up' as const },
    ];

    return {
      breakingNews,
      newsList: filtered,
      topAffectedAssets,
    };
  }

  async getNewsById(id: string): Promise<IntelligenceNews | null> {
    const data = await this.getNews();
    return data.newsList.find((n) => n.id === id) || null;
  }
}
