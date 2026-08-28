import { globalCache } from '../../core/cache/MemoryCache';

export interface NewsItemDto {
  id: string;
  title: string;
  summary: string;
  source: string;
  scope: 'nacional' | 'internacional';
  region?: 'Argentina 🇦🇷' | 'Estados Unidos 🇺🇸' | 'Global / Wall Street 🌐';
  publishedAt: string;
  editionDate: string; // Fecha de la edición del día 'YYYY-MM-DD'
  impactLevel: 'critico' | 'alto' | 'moderado';
  affectedAssets: string[];
  keyTakeaways: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  leadAnalysis?: string;
  transmissionChannel?: string;
  marketConsensus?: string;
}

export interface DailyNewsFeedResponse {
  editionDate: string;
  editionFormatted: string;
  totalNews: number;
  nationalCount: number;
  internationalCount: number;
  news: NewsItemDto[];
}

export class NewsService {
  // Retorna la fecha actual en zona horaria de Argentina (YYYY-MM-DD)
  private static getTodayDateString(): string {
    const d = new Date();
    // Ajustar a hora Argentina (UTC-3)
    const arDate = new Date(d.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
    const yyyy = arDate.getFullYear();
    const mm = String(arDate.getMonth() + 1).padStart(2, '0');
    const dd = String(arDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private static getTodayFormatted(): string {
    return new Date().toLocaleDateString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  static async getNewsFeed(): Promise<DailyNewsFeedResponse> {
    const today = this.getTodayDateString();
    const cacheKey = `news_daily_edition_${today}`;

    // La edición diaria queda en memoria RAM durante toda la jornada y se auto-renueva a medianoche
    return globalCache.getOrSet(
      cacheKey,
      async () => {
        const editionFormatted = this.getTodayFormatted();

        const newsList: NewsItemDto[] = [
          // ==========================================
          // 🇦🇷 1. FUENTES NACIONALES (Economía & BCRA)
          // ==========================================
          {
            id: `news-nat-1-${today}`,
            title: 'El BCRA profundiza la absorción de liquidez y consolida el ancla de tasas en LEFIs',
            summary: 'La migración hacia letras del Tesoro completó el saneamiento del balance y eliminó la emisión endógena por intereses de pasivos remunerados.',
            source: 'Ámbito Financiero / BCRA',
            scope: 'nacional',
            region: 'Argentina 🇦🇷',
            publishedAt: 'Hace 20 min',
            editionDate: today,
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
            id: `news-nat-2-${today}`,
            title: 'La inflación mayorista (IPIM) desacelera al 1.8% y anticipa menor presión sobre precios al consumidor',
            summary: 'El relevamiento del INDEC mostró caídas en productos primarios e importados, reforzando la tendencia desinflacionaria de alta frecuencia.',
            source: 'Infobae Economía',
            scope: 'nacional',
            region: 'Argentina 🇦🇷',
            publishedAt: 'Hace 50 min',
            editionDate: today,
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
            id: `news-nat-3-${today}`,
            title: 'Las compras de reservas del BCRA en el MULC superan la meta del trimestre tras récord del superávit comercial',
            summary: 'El superávit comercial energético y agrícola continúa aportando divisas genuinas al mercado oficial de cambios.',
            source: 'El Cronista Comercial',
            scope: 'nacional',
            region: 'Argentina 🇦🇷',
            publishedAt: 'Hace 2 horas',
            editionDate: today,
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
            id: `news-nat-4-${today}`,
            title: 'Se formalizan las primeras solicitudes de grandes inversiones bajo el RIGI por más de US$ 30.000 millones',
            summary: 'Proyectos de gas natural licuado (GNL) en Río Negro y minería de cobre en San Juan ingresaron al comité evaluador ministerial.',
            source: 'Boletín Oficial / MECON',
            scope: 'nacional',
            region: 'Argentina 🇦🇷',
            publishedAt: 'Hace 3 horas',
            editionDate: today,
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
            id: `news-nat-5-${today}`,
            title: 'El Tesoro capta más de $4 Billones en Lecaps y consolida la tasa fija en torno al 3.5% TEM',
            summary: 'Fuerte demanda de bancos y fondos comunes de inversión por títulos de tasa fija convalidando alargamiento de vencimientos hacia 2026.',
            source: 'Ámbito Financiero',
            scope: 'nacional',
            region: 'Argentina 🇦🇷',
            publishedAt: 'Hace 5 horas',
            editionDate: today,
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

          // =========================================================================
          // 🌐 2. FUENTES INTERNACIONALES, ESTADOS UNIDOS & COMMODITIES GLOBALES
          // =========================================================================
          {
            id: `news-int-1-${today}`,
            title: 'La Reserva Federal (Fed) perfila un sendero de recortes de tasas y desata compras en activos emergentes',
            summary: 'Jerome Powell y los miembros del FOMC señalaron que la moderación salarial y del empleo en EE.UU. justifican iniciar la relajación monetaria, debilitando al dólar global (DXY).',
            source: 'Bloomberg / Federal Reserve',
            scope: 'internacional',
            region: 'Estados Unidos 🇺🇸',
            publishedAt: 'Hace 30 min',
            editionDate: today,
            impactLevel: 'critico',
            affectedAssets: ['Tasa Fed (5.25%)', 'US 10Y Yield', 'GGAL ADR', 'BMA ADR', 'AL30D'],
            keyTakeaways: [
              'Rendimiento del bono del Tesoro a 10 años cae por debajo de 3.85%.',
              'El dólar global (DXY) retrocede, aliviando presiones cambiarias en la región.',
              'Flujo masivo de capitales hacia títulos de deuda soberana de alto rendimiento (High Yield).',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'Un ciclo de relajación de la Fed reduce el costo de fondeo internacional y crea un "viento de cola" ideal para la deuda soberana y los bancos argentinos.',
            transmissionChannel: 'Canal de transmisión: Menor tasa libre de riesgo en EE.UU. incentiva a fondos de Wall Street a aumentar ponderación en bonos Globales AL30/GD30 y ADRs bancarios (GGAL, BMA).',
            marketConsensus: 'Consenso Wall Street: Aceleración en la compresión del riesgo país hacia niveles de acceso a mercados voluntarios.',
          },
          {
            id: `news-int-2-${today}`,
            title: 'El petróleo WTI y Brent repuntan por tensiones en Medio Oriente y potencian la rentabilidad de Vaca Muerta',
            summary: 'El crudo supera los US$ 78 por barril en Nueva York ante riesgos de suministro global, beneficiando fuertemente el perfil exportador de las petroleras argentinas.',
            source: 'The Wall Street Journal (WSJ) / CME Group',
            scope: 'internacional',
            region: 'Global / Wall Street 🌐',
            publishedAt: 'Hace 1 hora',
            editionDate: today,
            impactLevel: 'alto',
            affectedAssets: ['Petróleo WTI (USD 78+)', 'YPF ADR', 'Vista Energy (VIST)', 'Pampa Energía (PAMP)'],
            keyTakeaways: [
              'WTI avanza 2.4% y consolida soporte técnico.',
              'Las exportaciones de crudo desde la cuenca neuquina alcanzan máximos históricos de 150.000 bpd.',
              'Proyección de superávit de balanza comercial energética supera los US$ 5.000 millones.',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'Los altos precios del petróleo internacional maximizan el margen de exportación de shale oil sin comprometer los precios internos estabilizados.',
            transmissionChannel: 'Mayores ingresos por exportaciones generan liquidación genuina en el MULC e incrementan los múltiplos de valuación (EV/EBITDA) de YPF y Vista en Wall Street.',
            marketConsensus: 'Consenso: Fuerte flujo de fondos hacia ADRs energéticos en el NYSE.',
          },
          {
            id: `news-int-3-${today}`,
            title: 'La soja y el maíz repuntan en la Bolsa de Chicago (CBOT) y mejoran la liquidación de divisas del agro',
            summary: 'Compras estratégicas de fondos de cobertura y demanda de molienda en Asia impulsan las cotizaciones de granos y subproductos en el mercado de Chicago.',
            source: 'Reuters Commodities / CBOT',
            scope: 'internacional',
            region: 'Global / Wall Street 🌐',
            publishedAt: 'Hace 2 horas',
            editionDate: today,
            impactLevel: 'alto',
            affectedAssets: ['Soja Chicago CBOT', 'Liquidación CIARA-CEC', 'Reservas BCRA', 'Dólar Mayorista'],
            keyTakeaways: [
              'Contrato de soja en CBOT avanza hacia los US$ 385 / tonelada.',
              'Harina y aceite de soja registran demanda sostenida en el sudeste asiático.',
              'Mejora de US$ 800 millones en las estimaciones de exportaciones del complejo agroindustrial.',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'El rebote en Chicago incrementa el valor FOB de los embarques argentinos en los puertos del Gran Rosario (Up-River).',
            transmissionChannel: 'Mayor liquidación de dólares por el esquema exportador 80/20 (MULC / CCL), fortaleciendo las reservas netas del BCRA.',
            marketConsensus: 'Consenso: Mayor liquidez de divisas comerciales durante el trimestre.',
          },
          {
            id: `news-int-4-${today}`,
            title: 'El IPC de Estados Unidos confirma la desinflación y Wall Street anota máximos históricos en el S&P 500',
            summary: 'La inflación interanual en EE.UU. se ubicó en línea con las expectativas del mercado, disipando temores de recesión y elevando el apetito por activos de riesgo.',
            source: 'Financial Times (FT) / US BLS',
            scope: 'internacional',
            region: 'Estados Unidos 🇺🇸',
            publishedAt: 'Hace 4 horas',
            editionDate: today,
            impactLevel: 'moderado',
            affectedAssets: ['S&P 500', 'Nasdaq 100', 'S&P Merval', 'ADRs Argentinos'],
            keyTakeaways: [
              'S&P 500 y Nasdaq operan en zona de máximos históricos.',
              'Índice de volatilidad VIX retrocede a niveles de calma (14.5 pts).',
              'El optimismo en Wall Street tracciona las acciones latinoamericanas.',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'Un escenario de "aterrizaje suave" (soft landing) en Estados Unidos expande el apetito global por acciones y deuda corporativa de mercados emergentes.',
            transmissionChannel: 'Correlación positiva entre el S&P 500 y el S&P Merval en dólares CCL.',
            marketConsensus: 'Consenso: Menor aversión al riesgo global favorece a las acciones argentinas de beta alto.',
          },
          {
            id: `news-int-5-${today}`,
            title: 'El FMI y fondos de Wall Street destacan la consolidación fiscal argentina en Washington',
            summary: 'Analistas del Fondo Monetario Internacional y bancos de inversión valoran el sobrecumplimiento de las metas de superávit financiero de cara a las próximas revisiones técnicas.',
            source: 'J.P. Morgan & IMF Communications',
            scope: 'internacional',
            region: 'Estados Unidos 🇺🇸',
            publishedAt: 'Hace 6 horas',
            editionDate: today,
            impactLevel: 'moderado',
            affectedAssets: ['GD30', 'GD35', 'AL30', 'Bonares'],
            keyTakeaways: [
              'Revisión al alza de los precios objetivo de los bonos Globales Ley Nueva York.',
              'Apoyo de directores de EE.UU. y Europa para avanzar en un nuevo acuerdo financiero.',
              'Riesgo país con sendero técnico hacia la zona de 400-450 puntos básicos.',
            ],
            sentiment: 'bullish',
            leadAnalysis: 'El respaldo explícito de la comunidad financiera internacional refuerza la credibilidad del programa económico y la sostenibilidad de la deuda soberana.',
            transmissionChannel: 'Menor prima de riesgo país facilita la refinanciación de vencimientos de capital e intereses en 2025/2026.',
            marketConsensus: 'Consenso: Mantener postura Overweight en títulos soberanos argentinos.',
          },
        ];

        return {
          editionDate: today,
          editionFormatted,
          totalNews: newsList.length,
          nationalCount: newsList.filter((n) => n.scope === 'nacional').length,
          internationalCount: newsList.filter((n) => n.scope === 'internacional').length,
          news: newsList,
        };
      },
      // 12 horas en memoria RAM: se actualiza a medianoche automáticamente con la fecha del nuevo día
      12 * 60 * 60 * 1000
    );
  }
}
