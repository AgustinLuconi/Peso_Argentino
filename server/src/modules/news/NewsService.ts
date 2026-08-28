import { globalCache } from '../../core/cache/MemoryCache';

export interface NewsItemDto {
  id: string;
  title: string;
  summary: string;
  source: string;
  scope: 'nacional' | 'internacional';
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
  private static readonly TTL_MS = 15 * 60 * 1000; // 15 minutos en memoria RAM (temporal, sin saturar SQLite)

  static async getNewsFeed(): Promise<NewsItemDto[]> {
    return globalCache.getOrSet(
      'news_feed_v1_multisource',
      async () => {
        return [
          // --- FUENTES NACIONALES 🇦🇷 ---
          {
            id: 'news-nat-1',
            title: 'El BCRA profundiza la absorción de liquidez y consolida el ancla de tasas en LEFIs',
            summary: 'La migración hacia letras del Tesoro completó el saneamiento del balance y eliminó la emisión endógena por intereses de pasivos remunerados.',
            source: 'Ámbito Financiero / BCRA',
            scope: 'nacional',
            publishedAt: 'Hace 15 min',
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
            id: 'news-nat-2',
            title: 'La inflación mayorista (IPIM) desacelera al 1.8% y anticipa menor presión sobre precios al consumidor',
            summary: 'El relevamiento del INDEC mostró caídas en productos primarios e importados, reforzando la tendencia desinflacionaria de alta frecuencia.',
            source: 'Infobae Economía',
            scope: 'nacional',
            publishedAt: 'Hace 45 min',
            impactLevel: 'alto',
            affectedAssets: ['Lecaps', 'Bonos CER', 'IPC INDEC'],
            keyTakeaways: [
              'El índice mayorista perfora el 2% mensual por primera vez en 4 años.',
              'Menor traspaso a precios minoristas para los próximos meses.',
              'Alineación con el sendero de crawling peg oficial al 2% m/m.',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'La contracción del IPIM confirma el ancla monetaria y reduce el riesgo de inercia inflacionaria en el segundo semestre.',
            transmissionChannel: 'Menores costos de insumos importados por estabilización cambiaria y baja de aranceles.',
            marketConsensus: 'Consenso: Rendimientos reales positivos en instrumentos a tasa fija capitalizables en pesos.',
          },
          {
            id: 'news-nat-3',
            title: 'Las compras de reservas del BCRA en el MULC superan la meta del trimestre',
            summary: 'El superávit comercial energético y agrícola continúa aportando divisas genuinas al mercado oficial de cambios.',
            source: 'El Cronista Comercial',
            scope: 'nacional',
            publishedAt: 'Hace 2 horas',
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
            id: 'news-nat-4',
            title: 'Se formalizan las primeras solicitudes de grandes inversiones bajo el RIGI por más de US$ 30.000 millones',
            summary: 'Proyectos de gas natural licuado (GNL) en Río Negro y minería de cobre en San Juan ingresaron al comité evaluador ministerial.',
            source: 'Boletín Oficial / MECON',
            scope: 'nacional',
            publishedAt: 'Hace 3 horas',
            impactLevel: 'alto',
            affectedAssets: ['YPF', 'PAMP', 'TXAR', 'TGS'],
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
          {
            id: 'news-nat-5',
            title: 'El Tesoro capta más de $4 Billones en Lecaps y alarga el perfil de vencimientos a 2026',
            summary: 'Fuerte demanda de bancos y fondos comunes de inversión por títulos de tasa fija convalidando tasas del 3.5% TEM a 3.7% TEM.',
            source: 'Ámbito Financiero',
            scope: 'nacional',
            publishedAt: 'Hace 5 horas',
            impactLevel: 'moderado',
            affectedAssets: ['S31E5', 'S30Y5', 'T15D5', 'Curva Lecap'],
            keyTakeaways: [
              'Roll-over de deuda en pesos superior al 140%.',
              'Alargamiento voluntario de plazos hacia mediados de 2026.',
              'Compresión de tasas nominales en todo el tramo corto y medio.',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'La colocación exitosa demuestra confianza del sistema bancario en la liquidez y solvencia del Tesoro Nacional.',
            transmissionChannel: 'El fondeo genuino en pesos reduce la necesidad de asistencia del Banco Central.',
            marketConsensus: 'Estrategia de carry trade institucional atractiva frente a la estabilidad del tipo de cambio financiero.',
          },

          // --- FUENTES INTERNACIONALES & WALL STREET 🌐 ---
          {
            id: 'news-int-1',
            title: 'Wall Street Rebalances Toward Argentine Dollar Bonds as Country Risk Hits 5-Year Low',
            summary: 'Global asset managers and emerging market debt funds increase exposure to AL30 and GD30 sovereign notes citing unprecedented fiscal surplus.',
            source: 'Bloomberg Markets',
            scope: 'internacional',
            publishedAt: 'Hace 30 min',
            impactLevel: 'critico',
            affectedAssets: ['AL30D', 'GD30D', 'EMBI+ Arg (505 bps)'],
            keyTakeaways: [
              'Riesgo país argentino perfora los 510 puntos básicos hacia mínimos desde 2019.',
              'Paridades de bonos soberanos rebotan del 20% al 65%-68%.',
              'Fondos institucionales de Nueva York y Londres incrementan ponderación en carteras EM.',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'La estricta disciplina fiscal y la acumulación de reservas están transformando la percepción de solvencia crediticia internacional de Argentina.',
            transmissionChannel: 'Canal de transmisión: Menor costo de capital internacional facilitará el financiamiento corporativo privado.',
            marketConsensus: 'Consenso Wall Street: Rendimientos de los bonos Globales convergen hacia curvas soberanas de pares regionales (B+ / BB-).',
          },
          {
            id: 'news-int-2',
            title: 'Argentina Fiscal Discipline and Monetary Anchors Draw Scrutiny from Global Private Equity',
            summary: 'Infrastructure and natural resource investors evaluate long-term capital allocation in Vaca Muerta shale gas and lithium mining ventures.',
            source: 'The Wall Street Journal (WSJ)',
            scope: 'internacional',
            publishedAt: 'Hace 1 hora',
            impactLevel: 'alto',
            affectedAssets: ['YPF ADR', 'PAMP ADR', 'LITIO', 'VACA MUERTA'],
            keyTakeaways: [
              'Compromiso fiscal inquebrantable como ancla macroeconómica primaria.',
              'Desregulación del mercado energético impulsa contratos de exportación de crudo.',
              'Creciente interés de fondos de infraestructura estadounidenses.',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'La consolidación de un entorno pro-mercado y reglas claras de inversión mitigan el riesgo regulatorio histórico.',
            transmissionChannel: 'Inversión Extranjera Directa (IED) sostenida refuerza la balanza de pagos a mediano plazo.',
            marketConsensus: 'Consenso: Crecimiento exponencial proyectado en exportaciones de hidrocarburos hacia 2027.',
          },
          {
            id: 'news-int-3',
            title: 'Argentina Trade Balance Expands on Surging Energy Surplus and Bumper Agricultural Harvest',
            summary: 'Energy trade deficit has turned into a projected US$ 5.0 billion surplus for the full year, transforming the external liquidity profile.',
            source: 'Financial Times (FT)',
            scope: 'internacional',
            publishedAt: 'Hace 4 horas',
            impactLevel: 'alto',
            affectedAssets: ['Balanza Comercial', 'Reservas BCRA', 'Dólar Mayorista'],
            keyTakeaways: [
              'Inversión del déficit energético histórico a superávit neto de divisas.',
              'Gasoducto y oleoductos operativos maximizan envíos al exterior.',
              'Alivio estructural para la cuenta corriente cambiaria.',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'El cambio estructural de la matriz energética elimina una de las principales fuentes de drenaje de reservas de las últimas dos décadas.',
            transmissionChannel: 'Mayor oferta neta de dólares comerciales en el mercado oficial de cambios.',
            marketConsensus: 'Sustentabilidad cambiaria robustecida de cara a la unificación y salida del cepo.',
          },
          {
            id: 'news-int-4',
            title: 'J.P. Morgan Emerging Markets Note: Argentine Sovereign Curve Steepens with Improving Debt Metrics',
            summary: 'Research desk highlights solid debt-to-GDP ratio trajectory and zero fiscal deficit as primary catalysts for continued bond appreciation.',
            source: 'J.P. Morgan Global Research',
            scope: 'internacional',
            publishedAt: 'Hace 6 horas',
            impactLevel: 'moderado',
            affectedAssets: ['GD35', 'GD41', 'GD46', 'Bonares'],
            keyTakeaways: [
              'Revisión al alza de los precios objetivo de los bonos Globales Ley Nueva York.',
              'Probabilidad reducida de eventos de reestructuración en el mediano plazo.',
              'Recomendación Overweight en títulos soberanos en moneda dura.',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'El reporte de J.P. Morgan valida la sostenibilidad del ancla fiscal y el cumplimiento puntual de los servicios de amortización e intereses.',
            transmissionChannel: 'Mejora en las calificaciones crediticias soberanas por parte de agencias internacionales (S&P, Moody\'s, Fitch).',
            marketConsensus: 'Riesgo país con sendero técnico hacia la zona de 400-450 puntos básicos.',
          },
          {
            id: 'news-int-5',
            title: 'Reuters Daily LatAm Wrap: Argentine Assets Outperform Regional Benchmarks Amid FX Stability',
            summary: 'The S&P Merval index and dollar bonds lead Latin American financial market gains as parallel exchange rate spread stays subdued.',
            source: 'Reuters Financial',
            scope: 'internacional',
            publishedAt: 'Hace 8 horas',
            impactLevel: 'moderado',
            affectedAssets: ['S&P Merval', 'GGAL', 'BMA', 'Dólar Blue'],
            keyTakeaways: [
              'ADRs de bancos y energéticas argentinas lideran subas en la Bolsa de Nueva York.',
              'Brecha cambiaria en mínimos sostenidos consolida la calma financiera.',
              'Flujo sostenido de inversores institucionales no residentes.',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'El rendimiento relativo de los activos argentinos supera al Bovespa y al IPC de México en lo que va del año.',
            transmissionChannel: 'Arbitraje positivo entre cotizaciones locales (BYMA) y certificados extranjeros (ADRs NYSE).',
            marketConsensus: 'Consenso: Apetito inversor sostenido con sesgo alcista en el sector bancario y de servicios públicos.',
          },
        ];
      },
      NewsService.TTL_MS
    );
  }
}
