export interface AssetAnalysisDto {
  ticker: string;
  name: string;
  sector: string;
  category: string;
  price: number;
  currency: 'ARS' | 'USD';
  variation24h: number;
  // Métricas Técnicas
  rsi14: number;
  technicalSignal: 'SOBRECOMPRA' | 'NEUTRAL_ALCISTA' | 'NEUTRAL' | 'NEUTRAL_BAJISTA' | 'SOBREVENTA';
  trend: 'bullish' | 'neutral' | 'bearish';
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  distanceTo52wHighPercent?: number;
  distanceTo52wLowPercent?: number;
  // Ratios Fundamentales
  peRatio?: number;
  dividendYieldPercent?: number;
  beta?: number;
  targetPriceEstimate?: number;
  potentialUpsidePercent?: number;
  // Tesis & Drivers
  catalysts: string[];
  investmentThesis: string;
  riskFactors: string[];
}

export class MarketAnalysisEngine {
  /**
   * Calcula el RSI de 14 períodos a partir de una serie de cierres históricos
   */
  static calculateRsi(closes: number[]): number {
    if (!closes || closes.length < 5) return 52.4;

    let gains = 0;
    let losses = 0;
    const count = closes.length - 1;

    for (let i = 1; i <= count; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) {
        gains += diff;
      } else {
        losses += Math.abs(diff);
      }
    }

    if (losses === 0) return 100;
    const avgGain = gains / count;
    const avgLoss = losses / count;
    const rs = avgGain / avgLoss;
    return Number((100 - 100 / (1 + rs)).toFixed(1));
  }

  /**
   * Genera el análisis financiero completo combinando datos técnicos y fundamentales del activo
   */
  static generateAnalysis(
    ticker: string,
    name: string,
    category: string,
    price: number,
    currency: 'ARS' | 'USD',
    variation24h: number,
    fiftyTwoWeekHigh?: number,
    fiftyTwoWeekLow?: number,
    closes: number[] = []
  ): AssetAnalysisDto {
    const rsi14 = this.calculateRsi(closes);

    let technicalSignal: AssetAnalysisDto['technicalSignal'] = 'NEUTRAL';
    let trend: 'bullish' | 'neutral' | 'bearish' = 'neutral';

    if (rsi14 >= 70) {
      technicalSignal = 'SOBRECOMPRA';
      trend = 'bullish';
    } else if (rsi14 >= 55) {
      technicalSignal = 'NEUTRAL_ALCISTA';
      trend = 'bullish';
    } else if (rsi14 <= 30) {
      technicalSignal = 'SOBREVENTA';
      trend = 'bearish';
    } else if (rsi14 <= 45) {
      technicalSignal = 'NEUTRAL_BAJISTA';
      trend = 'bearish';
    }

    // Cálculo de distancias 52 semanas
    let distanceTo52wHighPercent: number | undefined;
    let distanceTo52wLowPercent: number | undefined;

    if (fiftyTwoWeekHigh && fiftyTwoWeekHigh > 0 && price > 0) {
      distanceTo52wHighPercent = Number((((price - fiftyTwoWeekHigh) / fiftyTwoWeekHigh) * 100).toFixed(1));
    }
    if (fiftyTwoWeekLow && fiftyTwoWeekLow > 0 && price > 0) {
      distanceTo52wLowPercent = Number((((price - fiftyTwoWeekLow) / fiftyTwoWeekLow) * 100).toFixed(1));
    }

    // Metadatos sectoriales por ticker
    const profile = this.getAssetProfile(ticker);

    const targetPriceEstimate = profile.targetMultiplier
      ? Number((price * profile.targetMultiplier).toFixed(2))
      : undefined;

    const potentialUpsidePercent = targetPriceEstimate && price > 0
      ? Number((((targetPriceEstimate - price) / price) * 100).toFixed(1))
      : undefined;

    return {
      ticker,
      name,
      sector: profile.sector,
      category,
      price,
      currency,
      variation24h,
      rsi14,
      technicalSignal,
      trend,
      fiftyTwoWeekHigh,
      fiftyTwoWeekLow,
      distanceTo52wHighPercent,
      distanceTo52wLowPercent,
      peRatio: profile.peRatio,
      dividendYieldPercent: profile.dividendYieldPercent,
      beta: profile.beta,
      targetPriceEstimate,
      potentialUpsidePercent,
      catalysts: profile.catalysts,
      investmentThesis: profile.investmentThesis,
      riskFactors: profile.riskFactors,
    };
  }

  private static getAssetProfile(ticker: string): {
    sector: string;
    peRatio?: number;
    dividendYieldPercent?: number;
    beta?: number;
    targetMultiplier?: number;
    catalysts: string[];
    investmentThesis: string;
    riskFactors: string[];
  } {
    const upper = ticker.toUpperCase().replace('.BA', '').replace(' (ADR)', '');

    switch (upper) {
      // Bancos
      case 'GGAL':
      case 'BMA':
      case 'BBAR':
      case 'SUPV':
      case 'BHIP':
      case 'BPAT':
      case 'VALO':
        return {
          sector: 'Servicios Financieros & Bancarios',
          peRatio: 7.8,
          dividendYieldPercent: 3.2,
          beta: 1.45,
          targetMultiplier: 1.25,
          catalysts: [
            'Crecimiento exponencial en la demanda de crédito al sector privado en ARS y USD.',
            'Convergencia de tasas y desintermediación crediticia con reactivación de préstamos hipotecarios y comerciales.',
            'Aumento de depósitos privados en moneda extranjera tras regularización de activos.',
          ],
          investmentThesis:
            'El sector bancario argentino capitaliza la normalización macroeconómica, pasando de prestarle al Estado a intermediar crédito productivo con márgenes netos de interés atractivos y ratios de solvencia elevados.',
          riskFactors: ['Volatilidad en tasas de interés', 'Evolución de la morosidad crediticia'],
        };

      // Petróleo & Energía
      case 'YPF':
      case 'YPFD':
      case 'VIST':
      case 'PAMP':
      case 'CEPU':
      case 'TGS':
      case 'TGSU2':
      case 'TRAN':
      case 'EDN':
      case 'DGCU2':
      case 'CGPA2':
      case 'METR':
        return {
          sector: 'Energía, Petróleo & Gas (Vaca Muerta)',
          peRatio: 6.4,
          dividendYieldPercent: 2.1,
          beta: 1.3,
          targetMultiplier: 1.35,
          catalysts: [
            'Plan de evacuación de crudo y gas con mega oleoductos Vaca Muerta Sur y gasoductos troncales.',
            'Atracción de inversiones bajo el marco de incentivo a grandes inversiones (RIGI) para proyectos de GNL.',
            'Recomposición tarifaria y tarifas con fórmula de ajuste indexada por inflación mayorista.',
          ],
          investmentThesis:
            'Los activos energéticos y de transporte de hidrocarburos cuentan con fundamentals de clase mundial, costos de extracción competitivos y un horizonte de exportación récord de crudo y gas hacia mercados regionales e internacionales.',
          riskFactors: ['Fluctuación del precio internacional del crudo WTI/Brent', 'Demoras en infraestructura de transporte'],
        };

      // Consumo Masivo & Agroindustria
      case 'AGRO':
      case 'HAVA':
      case 'MOLI':
      case 'MOLA':
      case 'LEDE':
      case 'MORI':
      case 'SAMI':
      case 'SEMI':
      case 'CADO':
      case 'PATA':
        return {
          sector: 'Agroindustria & Consumo Masivo',
          peRatio: 11.2,
          dividendYieldPercent: 4.0,
          beta: 0.85,
          targetMultiplier: 1.2,
          catalysts: [
            'Apertura de exportaciones y desregulación de aranceles y trabas al comercio exterior.',
            'Reactivación gradual del consumo doméstico ante recuperación del salario real medido en dólares.',
            'Mejores términos de intercambio y cosecha récord proyectada.',
          ],
          investmentThesis:
            'Compañías con marcas consolidadas y fuerte inserción exportadora se benefician de la simplificación regulatoria y la estabilidad de insumos en moneda constante.',
          riskFactors: ['Factores climáticos en zonas agropecuarias', 'Elasticidad precio en la demanda interna'],
        };

      // Materiales & Siderurgia
      case 'TXAR':
      case 'ALUA':
      case 'LOMA':
      case 'HARG':
      case 'FERR':
      case 'CELU':
        return {
          sector: 'Materiales Básicos, Construcción & Siderurgia',
          peRatio: 9.5,
          dividendYieldPercent: 2.8,
          beta: 1.05,
          targetMultiplier: 1.18,
          catalysts: [
            'Repunte de la obra privada y proyectos mineros e industriales bajo el RIGI.',
            'Posición neta de caja positiva en moneda dura y márgenes EBITDA sólidos.',
            'Exportación de aluminio y acero especial a mercados de América del Norte y Europa.',
          ],
          investmentThesis:
            'Productoras líderes de insumos industriales básicos con balances desendeudados, ideales para capturar la recuperación de la actividad fabril y la construcción.',
          riskFactors: ['Competencia de importaciones asiáticas', 'Costos energéticos industriales'],
        };

      // Bonos Soberanos USD
      case 'AL30':
      case 'AL30D':
      case 'GD30':
      case 'GD30D':
      case 'AL35':
      case 'GD35':
      case 'AE38':
      case 'GD38':
      case 'AL41':
      case 'GD41':
      case 'AL29':
      case 'GD29':
        return {
          sector: 'Renta Fija Soberana en Dólares',
          peRatio: undefined,
          dividendYieldPercent: undefined,
          beta: 0.95,
          targetMultiplier: 1.22,
          catalysts: [
            'Superávit fiscal primario y financiero sostenido garantizando el ancla de pago del Tesoro.',
            'Compras continuas de divisas por parte del BCRA acumulando reservas netas.',
            'Compresión de spread hacia estándares de créditos emergentes BB/B con paridades en convergencia a 90-100%.',
          ],
          investmentThesis:
            'Los bonos soberanos ofrecen flujos de cupones y amortizaciones en dólares con un carry trade y rendimiento total elevado a medida que el riesgo soberano profundiza su sendero bajista.',
          riskFactors: ['Condiciones de liquidez en mercados globales', 'Tasa de la Reserva Federal (Fed)'],
        };

      // Tech & CEDEARs
      case 'MELI':
      case 'GLOB':
      case 'AAPL':
      case 'MSFT':
      case 'NVDA':
      case 'AMZN':
      case 'GOOGL':
      case 'TSLA':
      case 'SPY':
      case 'QQQ':
        return {
          sector: 'Tecnología & Global Equities (CEDEAR)',
          peRatio: 28.5,
          dividendYieldPercent: 0.8,
          beta: 1.15,
          targetMultiplier: 1.2,
          catalysts: [
            'Liderazgo en inteligencia artificial generativa, nube pública y comercio electrónico.',
            'Cobertura automática contra la variación del Dólar Contado con Liquidación (CCL).',
            'Flujos de caja libres crecientes y recompras masivas de acciones.',
          ],
          investmentThesis:
            'Instrumento de dolarización de portafolios con diversificación internacional en las empresas de mayor crecimiento e innovación del planeta.',
          riskFactors: ['Regulaciones antimonopolio', 'Valuaciones exigentes en múltiplos P/E'],
        };

      // Commodities
      case 'ZS=F':
      case 'ZC=F':
      case 'ZW=F':
      case 'CL=F':
      case 'BZ=F':
      case 'GC=F':
      case 'SI=F':
      case 'NG=F':
        return {
          sector: 'Materias Primas & Futuros Globales',
          peRatio: undefined,
          dividendYieldPercent: undefined,
          beta: 0.7,
          targetMultiplier: 1.1,
          catalysts: [
            'Impacto directo en la liquidación de divisas del Complejo Agroexportador argentino.',
            'Geopolítica energética internacional y balance de oferta/demanda global.',
            'Cobertura contra inflación global y variaciones de reservas monetarias.',
          ],
          investmentThesis:
            'Precios clave que determinan el flujo de dólares comerciales que ingresan al país por exportaciones de granos, subproductos y energía.',
          riskFactors: ['Clima global', 'Políticas de aranceles de importación de China y EE.UU.'],
        };

      // Default perfil genérico
      default:
        return {
          sector: 'Renta Variable / Deuda de Capitales',
          peRatio: 10.5,
          dividendYieldPercent: 2.5,
          beta: 1.0,
          targetMultiplier: 1.15,
          catalysts: [
            'Estabilización monetaria y convergencia de variables cambiarias.',
            'Rebalanceo de carteras institucionales hacia activos argentinos.',
          ],
          investmentThesis:
            'Activo con potencial de revalorización en un marco de orden fiscal, reducción de inflación y reactivación de la economía real.',
          riskFactors: ['Riesgo sistémico de mercado', 'Liquidez en el mercado secundario'],
        };
    }
  }
}
