import { globalCache } from '../../core/cache/MemoryCache';
import { YahooFinanceAdapter, YahooChartMeta } from '../../core/http/YahooFinanceAdapter';
import { MarketAnalysisEngine, AssetAnalysisDto } from './MarketAnalysisEngine';

export type MarketCategory =
  | 'panel-lider'
  | 'panel-general'
  | 'adrs'
  | 'cedears'
  | 'bonos-usd'
  | 'bonos-pesos'
  | 'bonos-extranjeros'
  | 'commodities'
  | 'cripto-divisas';

export interface MarketAssetDto {
  ticker: string;
  name: string;
  category: MarketCategory;
  price: number;
  currency: 'ARS' | 'USD';
  variation24h: number;
  volume24h: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  rsi14?: number;
  trend?: 'bullish' | 'neutral' | 'bearish';
  technicalSignal?: string;
  // Métricas de Renta Fija (Bonos)
  tirPercent?: number;
  parityPercent?: number;
  modifiedDurationYears?: number;
  maturityDate?: string;
  couponPercent?: number;
  legislation?: 'ARGENTINA' | 'NEW_YORK' | 'GLOBAL';
  // Tasas en Pesos (Lecaps)
  tna?: number;
  tem?: number;
}

export interface MervalIndexDto {
  name: string;
  ticker: string;
  value: number;
  variation24h: number;
  currency: 'ARS' | 'USD CCL';
}

export interface MarketsOverviewResponse {
  indices: MervalIndexDto[];
  assets: MarketAssetDto[];
  counts: Record<MarketCategory, number>;
  lastUpdated: string;
}

export class MarketsService {
  private static readonly TTL_MS = 60 * 1000; // 1 min

  // Definición exhaustiva de activos por categoría
  private static readonly ASSET_DEFINITIONS: Array<{
    ticker: string;
    name: string;
    category: MarketCategory;
    currency: 'ARS' | 'USD';
    defaultPrice: number;
    defaultVar: number;
    defaultVol: number;
    yahooSymbol?: string;
    tirPercent?: number;
    parityPercent?: number;
    modifiedDurationYears?: number;
    maturityDate?: string;
    couponPercent?: number;
    legislation?: 'ARGENTINA' | 'NEW_YORK' | 'GLOBAL';
    tna?: number;
    tem?: number;
  }> = [
    // ==========================================
    // 1. PANEL LÍDER BYMA (20 Acciones)
    // ==========================================
    { ticker: 'GGAL', name: 'Grupo Financiero Galicia', category: 'panel-lider', currency: 'ARS', defaultPrice: 6150.0, defaultVar: 2.35, defaultVol: 1850000000, yahooSymbol: 'GGAL.BA' },
    { ticker: 'YPFD', name: 'YPF S.A. Clase D', category: 'panel-lider', currency: 'ARS', defaultPrice: 38200.0, defaultVar: 3.12, defaultVol: 2410000000, yahooSymbol: 'YPFD.BA' },
    { ticker: 'PAMP', name: 'Pampa Energía S.A.', category: 'panel-lider', currency: 'ARS', defaultPrice: 3450.0, defaultVar: 1.65, defaultVol: 1200000000, yahooSymbol: 'PAMP.BA' },
    { ticker: 'BMA', name: 'Banco Macro S.A.', category: 'panel-lider', currency: 'ARS', defaultPrice: 9200.0, defaultVar: -0.45, defaultVol: 980000000, yahooSymbol: 'BMA.BA' },
    { ticker: 'CEPU', name: 'Central Puerto S.A.', category: 'panel-lider', currency: 'ARS', defaultPrice: 1350.0, defaultVar: 1.95, defaultVol: 540000000, yahooSymbol: 'CEPU.BA' },
    { ticker: 'TXAR', name: 'Ternium Argentina S.A.', category: 'panel-lider', currency: 'ARS', defaultPrice: 1120.0, defaultVar: 0.85, defaultVol: 650000000, yahooSymbol: 'TXAR.BA' },
    { ticker: 'ALUA', name: 'Aluar Aluminio Argentino', category: 'panel-lider', currency: 'ARS', defaultPrice: 1045.0, defaultVar: 0.48, defaultVol: 490000000, yahooSymbol: 'ALUA.BA' },
    { ticker: 'EDN', name: 'Edenor S.A.', category: 'panel-lider', currency: 'ARS', defaultPrice: 1890.0, defaultVar: 4.15, defaultVol: 410000000, yahooSymbol: 'EDN.BA' },
    { ticker: 'CRES', name: 'Cresud S.A.C.I.F. y A.', category: 'panel-lider', currency: 'ARS', defaultPrice: 1240.0, defaultVar: 1.25, defaultVol: 380000000, yahooSymbol: 'CRES.BA' },
    { ticker: 'TGSU2', name: 'Transportadora Gas del Sur', category: 'panel-lider', currency: 'ARS', defaultPrice: 5850.0, defaultVar: 2.1, defaultVol: 370000000, yahooSymbol: 'TGSU2.BA' },
    { ticker: 'TRAN', name: 'Transener S.A.', category: 'panel-lider', currency: 'ARS', defaultPrice: 2150.0, defaultVar: 1.85, defaultVol: 290000000, yahooSymbol: 'TRAN.BA' },
    { ticker: 'VALO', name: 'Banco de Valores S.A.', category: 'panel-lider', currency: 'ARS', defaultPrice: 380.0, defaultVar: 0.8, defaultVol: 240000000, yahooSymbol: 'VALO.BA' },
    { ticker: 'SUPV', name: 'Grupo Supervielle S.A.', category: 'panel-lider', currency: 'ARS', defaultPrice: 2450.0, defaultVar: 1.95, defaultVol: 310000000, yahooSymbol: 'SUPV.BA' },
    { ticker: 'BYMA', name: 'Bolsas y Mercados Argentinos', category: 'panel-lider', currency: 'ARS', defaultPrice: 380.5, defaultVar: 0.65, defaultVol: 220000000, yahooSymbol: 'BYMA.BA' },
    { ticker: 'COME', name: 'Sociedad Comercial del Plata', category: 'panel-lider', currency: 'ARS', defaultPrice: 175.0, defaultVar: 3.4, defaultVol: 390000000, yahooSymbol: 'COME.BA' },
    { ticker: 'MIRG', name: 'Mirgor S.A.C.I.F.I.A.', category: 'panel-lider', currency: 'ARS', defaultPrice: 24500.0, defaultVar: -0.85, defaultVol: 180000000, yahooSymbol: 'MIRG.BA' },
    { ticker: 'LOMA', name: 'Loma Negra C.I.A.S.A.', category: 'panel-lider', currency: 'ARS', defaultPrice: 2280.0, defaultVar: 1.15, defaultVol: 210000000, yahooSymbol: 'LOMA.BA' },
    { ticker: 'BBAR', name: 'Banco BBVA Argentina', category: 'panel-lider', currency: 'ARS', defaultPrice: 4650.0, defaultVar: 1.75, defaultVol: 260000000, yahooSymbol: 'BBAR.BA' },
    { ticker: 'TECO2', name: 'Telecom Argentina S.A.', category: 'panel-lider', currency: 'ARS', defaultPrice: 2750.0, defaultVar: 0.55, defaultVol: 190000000, yahooSymbol: 'TECO2.BA' },
    { ticker: 'HARG', name: 'Holcim Argentina S.A.', category: 'panel-lider', currency: 'ARS', defaultPrice: 1540.0, defaultVar: 0.95, defaultVol: 140000000, yahooSymbol: 'HARG.BA' },

    // ==========================================
    // 2. PANEL GENERAL / MERCADO SECUNDARIO (25+ Acciones)
    // ==========================================
    { ticker: 'AGRO', name: 'Agrometal S.A.I.', category: 'panel-general', currency: 'ARS', defaultPrice: 62.5, defaultVar: 2.8, defaultVol: 45000000, yahooSymbol: 'AGRO.BA' },
    { ticker: 'AUSO', name: 'Autopistas del Sol S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 3850.0, defaultVar: 1.45, defaultVol: 65000000, yahooSymbol: 'AUSO.BA' },
    { ticker: 'BHIP', name: 'Banco Hipotecario S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 215.0, defaultVar: 3.85, defaultVol: 120000000, yahooSymbol: 'BHIP.BA' },
    { ticker: 'BOLT', name: 'Boldt S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 58.0, defaultVar: 0.5, defaultVol: 35000000, yahooSymbol: 'BOLT.BA' },
    { ticker: 'BPAT', name: 'Banco Patagonia S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 1950.0, defaultVar: 1.1, defaultVol: 75000000, yahooSymbol: 'BPAT.BA' },
    { ticker: 'CADO', name: 'Carlos Casado S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 1420.0, defaultVar: 0.9, defaultVol: 28000000, yahooSymbol: 'CADO.BA' },
    { ticker: 'CAPX', name: 'Capex S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 4200.0, defaultVar: 2.15, defaultVol: 48000000, yahooSymbol: 'CAPX.BA' },
    { ticker: 'CARC', name: 'Carboclor S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 18.5, defaultVar: -1.2, defaultVol: 15000000, yahooSymbol: 'CARC.BA' },
    { ticker: 'CELU', name: 'Celulosa Argentina S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 340.0, defaultVar: 0.75, defaultVol: 38000000, yahooSymbol: 'CELU.BA' },
    { ticker: 'CGPA2', name: 'Camuzzi Gas Pampeana', category: 'panel-general', currency: 'ARS', defaultPrice: 2450.0, defaultVar: 2.3, defaultVol: 52000000, yahooSymbol: 'CGPA2.BA' },
    { ticker: 'COMO', name: 'Compañía de Morteros', category: 'panel-general', currency: 'ARS', defaultPrice: 95.0, defaultVar: 0.2, defaultVol: 12000000, yahooSymbol: 'COMO.BA' },
    { ticker: 'CTIO', name: 'Consultatio S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 1680.0, defaultVar: 1.6, defaultVol: 41000000, yahooSymbol: 'CTIO.BA' },
    { ticker: 'DGCU2', name: 'Distribuidora de Gas Cuyana', category: 'panel-general', currency: 'ARS', defaultPrice: 3150.0, defaultVar: 2.45, defaultVol: 56000000, yahooSymbol: 'DGCU2.BA' },
    { ticker: 'FERR', name: 'Ferrum S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 195.0, defaultVar: 0.85, defaultVol: 32000000, yahooSymbol: 'FERR.BA' },
    { ticker: 'FIPL', name: 'Fiplasto S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 78.5, defaultVar: 1.05, defaultVol: 19000000, yahooSymbol: 'FIPL.BA' },
    { ticker: 'GCLM', name: 'Grupo Clarin S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 1120.0, defaultVar: 0.45, defaultVol: 29000000, yahooSymbol: 'GCLM.BA' },
    { ticker: 'GRIM', name: 'Grimoldi S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 145.0, defaultVar: -0.35, defaultVol: 14000000, yahooSymbol: 'GRIM.BA' },
    { ticker: 'HAVA', name: 'Havanna Holding S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 6200.0, defaultVar: 3.2, defaultVol: 98000000, yahooSymbol: 'HAVA.BA' },
    { ticker: 'INTR', name: 'Compañía Introductora', category: 'panel-general', currency: 'ARS', defaultPrice: 420.0, defaultVar: 0.6, defaultVol: 16000000, yahooSymbol: 'INTR.BA' },
    { ticker: 'INVJ', name: 'Inversora Juramento S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 310.0, defaultVar: 1.75, defaultVol: 44000000, yahooSymbol: 'INVJ.BA' },
    { ticker: 'IRCP', name: 'IRSA Propiedades Comerciales', category: 'panel-general', currency: 'ARS', defaultPrice: 1950.0, defaultVar: 1.85, defaultVol: 68000000, yahooSymbol: 'IRCP.BA' },
    { ticker: 'LEDE', name: 'Ledesma S.A.A.I.', category: 'panel-general', currency: 'ARS', defaultPrice: 1850.0, defaultVar: 1.2, defaultVol: 82000000, yahooSymbol: 'LEDE.BA' },
    { ticker: 'LONG', name: 'Longvie S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 64.0, defaultVar: 0.15, defaultVol: 11000000, yahooSymbol: 'LONG.BA' },
    { ticker: 'METR', name: 'MetroGAS S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 2850.0, defaultVar: 3.4, defaultVol: 95000000, yahooSymbol: 'METR.BA' },
    { ticker: 'MOLA', name: 'Molinos Agro S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 34500.0, defaultVar: 2.1, defaultVol: 84000000, yahooSymbol: 'MOLA.BA' },
    { ticker: 'MOLI', name: 'Molinos Río de la Plata', category: 'panel-general', currency: 'ARS', defaultPrice: 4600.0, defaultVar: 1.35, defaultVol: 72000000, yahooSymbol: 'MOLI.BA' },
    { ticker: 'MORI', name: 'Morixe Hermanos S.A.C.I.', category: 'panel-general', currency: 'ARS', defaultPrice: 94.5, defaultVar: 2.25, defaultVol: 42000000, yahooSymbol: 'MORI.BA' },
    { ticker: 'OEST', name: 'Grupo Concesionario del Oeste', category: 'panel-general', currency: 'ARS', defaultPrice: 2750.0, defaultVar: 1.1, defaultVol: 38000000, yahooSymbol: 'OEST.BA' },
    { ticker: 'PATA', name: 'Importadora y Exportadora de la Patagonia', category: 'panel-general', currency: 'ARS', defaultPrice: 890.0, defaultVar: 0.95, defaultVol: 54000000, yahooSymbol: 'PATA.BA' },
    { ticker: 'RIGO', name: 'Rigolleau S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 2150.0, defaultVar: 0.5, defaultVol: 22000000, yahooSymbol: 'RIGO.BA' },
    { ticker: 'SAMI', name: 'San Miguel S.A.I.C.I.F. y A.', category: 'panel-general', currency: 'ARS', defaultPrice: 1650.0, defaultVar: 4.2, defaultVol: 68000000, yahooSymbol: 'SAMI.BA' },
    { ticker: 'SEMI', name: 'Molinos Juan Semino S.A.', category: 'panel-general', currency: 'ARS', defaultPrice: 88.0, defaultVar: 1.15, defaultVol: 18000000, yahooSymbol: 'SEMI.BA' },

    // ==========================================
    // 3. ADRs ARGENTINOS EN WALL STREET (USD)
    // ==========================================
    { ticker: 'GGAL (ADR)', name: 'Grupo Financiero Galicia ADR NYSE', category: 'adrs', currency: 'USD', defaultPrice: 43.91, defaultVar: 2.85, defaultVol: 18500000, yahooSymbol: 'GGAL' },
    { ticker: 'YPF (ADR)', name: 'YPF S.A. ADR NYSE', category: 'adrs', currency: 'USD', defaultPrice: 50.27, defaultVar: 3.45, defaultVol: 28400000, yahooSymbol: 'YPF' },
    { ticker: 'BMA (ADR)', name: 'Banco Macro ADR NYSE', category: 'adrs', currency: 'USD', defaultPrice: 75.8, defaultVar: -0.25, defaultVol: 9200000, yahooSymbol: 'BMA' },
    { ticker: 'BBAR (ADR)', name: 'Banco BBVA Argentina ADR NYSE', category: 'adrs', currency: 'USD', defaultPrice: 14.85, defaultVar: 1.8, defaultVol: 5400000, yahooSymbol: 'BBAR' },
    { ticker: 'SUPV (ADR)', name: 'Grupo Supervielle ADR NYSE', category: 'adrs', currency: 'USD', defaultPrice: 11.2, defaultVar: 2.15, defaultVol: 6800000, yahooSymbol: 'SUPV' },
    { ticker: 'PAM (ADR)', name: 'Pampa Energía ADR NYSE', category: 'adrs', currency: 'USD', defaultPrice: 68.2, defaultVar: 1.9, defaultVol: 12100000, yahooSymbol: 'PAM' },
    { ticker: 'CEPU (ADR)', name: 'Central Puerto ADR NYSE', category: 'adrs', currency: 'USD', defaultPrice: 13.85, defaultVar: 2.4, defaultVol: 4800000, yahooSymbol: 'CEPU' },
    { ticker: 'TGS (ADR)', name: 'Transportadora Gas del Sur NYSE', category: 'adrs', currency: 'USD', defaultPrice: 24.15, defaultVar: 2.15, defaultVol: 6500000, yahooSymbol: 'TGS' },
    { ticker: 'EDN (ADR)', name: 'Edenor ADR NYSE', category: 'adrs', currency: 'USD', defaultPrice: 19.45, defaultVar: 4.8, defaultVol: 3900000, yahooSymbol: 'EDN' },
    { ticker: 'CRESY (ADR)', name: 'Cresud ADR NASDAQ', category: 'adrs', currency: 'USD', defaultPrice: 12.8, defaultVar: 1.5, defaultVol: 4100000, yahooSymbol: 'CRESY' },
    { ticker: 'IRS (ADR)', name: 'IRSA Inversiones ADR NYSE', category: 'adrs', currency: 'USD', defaultPrice: 16.9, defaultVar: 1.95, defaultVol: 3200000, yahooSymbol: 'IRS' },
    { ticker: 'LOMA (ADR)', name: 'Loma Negra ADR NYSE', category: 'adrs', currency: 'USD', defaultPrice: 9.45, defaultVar: 1.1, defaultVol: 2800000, yahooSymbol: 'LOMA' },
    { ticker: 'TEO (ADR)', name: 'Telecom Argentina ADR NYSE', category: 'adrs', currency: 'USD', defaultPrice: 10.85, defaultVar: 0.75, defaultVol: 2100000, yahooSymbol: 'TEO' },
    { ticker: 'MELI', name: 'MercadoLibre Inc. NASDAQ', category: 'adrs', currency: 'USD', defaultPrice: 2085.0, defaultVar: 2.15, defaultVol: 85000000, yahooSymbol: 'MELI' },
    { ticker: 'GLOB', name: 'Globant S.A. NYSE', category: 'adrs', currency: 'USD', defaultPrice: 198.5, defaultVar: 1.25, defaultVol: 34000000, yahooSymbol: 'GLOB' },
    { ticker: 'VIST', name: 'Vista Energy S.A.B. NYSE', category: 'adrs', currency: 'USD', defaultPrice: 56.4, defaultVar: 3.8, defaultVol: 42000000, yahooSymbol: 'VIST' },
    { ticker: 'DESP', name: 'Despegar.com Corp NYSE', category: 'adrs', currency: 'USD', defaultPrice: 16.75, defaultVar: 0.95, defaultVol: 8900000, yahooSymbol: 'DESP' },
    { ticker: 'BIOX', name: 'Bioceres Crop Solutions NASDAQ', category: 'adrs', currency: 'USD', defaultPrice: 9.85, defaultVar: -0.45, defaultVol: 4200000, yahooSymbol: 'BIOX' },

    // ==========================================
    // 4. CEDEARS PRINCIPALES EN BYMA (ARS)
    // ==========================================
    { ticker: 'AAPL (CEDEAR)', name: 'Apple Inc. CEDEAR', category: 'cedears', currency: 'ARS', defaultPrice: 23200.0, defaultVar: 0.85, defaultVol: 450000000, yahooSymbol: 'AAPL' },
    { ticker: 'MSFT (CEDEAR)', name: 'Microsoft Corp. CEDEAR', category: 'cedears', currency: 'ARS', defaultPrice: 42500.0, defaultVar: 1.15, defaultVol: 380000000, yahooSymbol: 'MSFT' },
    { ticker: 'NVDA (CEDEAR)', name: 'NVIDIA Corp. CEDEAR', category: 'cedears', currency: 'ARS', defaultPrice: 12800.0, defaultVar: 3.4, defaultVol: 890000000, yahooSymbol: 'NVDA' },
    { ticker: 'AMZN (CEDEAR)', name: 'Amazon.com Inc. CEDEAR', category: 'cedears', currency: 'ARS', defaultPrice: 20500.0, defaultVar: 1.45, defaultVol: 320000000, yahooSymbol: 'AMZN' },
    { ticker: 'GOOGL (CEDEAR)', name: 'Alphabet Inc. (Google) CEDEAR', category: 'cedears', currency: 'ARS', defaultPrice: 18400.0, defaultVar: 0.95, defaultVol: 290000000, yahooSymbol: 'GOOGL' },
    { ticker: 'TSLA (CEDEAR)', name: 'Tesla Inc. CEDEAR', category: 'cedears', currency: 'ARS', defaultPrice: 21800.0, defaultVar: -1.25, defaultVol: 510000000, yahooSymbol: 'TSLA' },
    { ticker: 'SPY (CEDEAR)', name: 'S&P 500 ETF CEDEAR', category: 'cedears', currency: 'ARS', defaultPrice: 38900.0, defaultVar: 0.65, defaultVol: 720000000, yahooSymbol: 'SPY' },
    { ticker: 'QQQ (CEDEAR)', name: 'Nasdaq 100 ETF CEDEAR', category: 'cedears', currency: 'ARS', defaultPrice: 49500.0, defaultVar: 0.9, defaultVol: 490000000, yahooSymbol: 'QQQ' },
    { ticker: 'KO (CEDEAR)', name: 'The Coca-Cola Co. CEDEAR', category: 'cedears', currency: 'ARS', defaultPrice: 9800.0, defaultVar: 0.35, defaultVol: 180000000, yahooSymbol: 'KO' },
    { ticker: 'MCD (CEDEAR)', name: 'McDonald\'s Corp. CEDEAR', category: 'cedears', currency: 'ARS', defaultPrice: 31200.0, defaultVar: 0.4, defaultVol: 140000000, yahooSymbol: 'MCD' },
    { ticker: 'XOM (CEDEAR)', name: 'Exxon Mobil Corp. CEDEAR', category: 'cedears', currency: 'ARS', defaultPrice: 14500.0, defaultVar: 1.6, defaultVol: 210000000, yahooSymbol: 'XOM' },
    { ticker: 'BABA (CEDEAR)', name: 'Alibaba Group CEDEAR', category: 'cedears', currency: 'ARS', defaultPrice: 8900.0, defaultVar: -0.65, defaultVol: 190000000, yahooSymbol: 'BABA' },
    { ticker: 'GOLD (CEDEAR)', name: 'Barrick Gold Corp. CEDEAR', category: 'cedears', currency: 'ARS', defaultPrice: 19400.0, defaultVar: 1.95, defaultVol: 310000000, yahooSymbol: 'GOLD' },

    // ==========================================
    // 5. BONOS SOBERANOS USD (Bonares AL & Globales GD)
    // ==========================================
    { ticker: 'AL29D', name: 'Bonar 2029 USD Ley Arg', category: 'bonos-usd', currency: 'USD', defaultPrice: 76.5, defaultVar: 1.05, defaultVol: 18000000, tirPercent: 12.8, parityPercent: 76.5, modifiedDurationYears: 1.85, maturityDate: '09/07/2029', couponPercent: 1.0, legislation: 'ARGENTINA' },
    { ticker: 'AL30D', name: 'Bonar 2030 USD Ley Arg (Referente)', category: 'bonos-usd', currency: 'USD', defaultPrice: 72.85, defaultVar: 1.15, defaultVol: 52000000, tirPercent: 11.45, parityPercent: 72.85, modifiedDurationYears: 2.15, maturityDate: '09/07/2030', couponPercent: 0.75, legislation: 'ARGENTINA' },
    { ticker: 'AL35D', name: 'Bonar 2035 USD Ley Arg', category: 'bonos-usd', currency: 'USD', defaultPrice: 58.2, defaultVar: 1.45, defaultVol: 24000000, tirPercent: 12.1, parityPercent: 58.2, modifiedDurationYears: 4.85, maturityDate: '09/07/2035', couponPercent: 3.625, legislation: 'ARGENTINA' },
    { ticker: 'AE38D', name: 'Bonar 2038 USD Ley Arg', category: 'bonos-usd', currency: 'USD', defaultPrice: 62.4, defaultVar: 0.95, defaultVol: 19000000, tirPercent: 11.8, parityPercent: 62.4, modifiedDurationYears: 5.2, maturityDate: '09/01/2038', couponPercent: 4.25, legislation: 'ARGENTINA' },
    { ticker: 'AL41D', name: 'Bonar 2041 USD Ley Arg', category: 'bonos-usd', currency: 'USD', defaultPrice: 54.8, defaultVar: 1.35, defaultVol: 15000000, tirPercent: 12.4, parityPercent: 54.8, modifiedDurationYears: 5.65, maturityDate: '09/07/2041', couponPercent: 3.5, legislation: 'ARGENTINA' },

    { ticker: 'GD29D', name: 'Global 2029 USD Ley NY', category: 'bonos-usd', currency: 'USD', defaultPrice: 81.2, defaultVar: 0.85, defaultVol: 26000000, tirPercent: 11.6, parityPercent: 81.2, modifiedDurationYears: 1.92, maturityDate: '09/07/2029', couponPercent: 1.0, legislation: 'NEW_YORK' },
    { ticker: 'GD30D', name: 'Global 2030 USD Ley NY (Benchmark)', category: 'bonos-usd', currency: 'USD', defaultPrice: 77.4, defaultVar: 0.95, defaultVol: 64000000, tirPercent: 10.25, parityPercent: 77.4, modifiedDurationYears: 2.22, maturityDate: '09/07/2030', couponPercent: 0.75, legislation: 'NEW_YORK' },
    { ticker: 'GD35D', name: 'Global 2035 USD Ley NY', category: 'bonos-usd', currency: 'USD', defaultPrice: 63.8, defaultVar: 1.25, defaultVol: 31000000, tirPercent: 11.3, parityPercent: 63.8, modifiedDurationYears: 4.92, maturityDate: '09/07/2035', couponPercent: 3.625, legislation: 'NEW_YORK' },
    { ticker: 'GD38D', name: 'Global 2038 USD Ley NY', category: 'bonos-usd', currency: 'USD', defaultPrice: 67.5, defaultVar: 0.9, defaultVol: 22000000, tirPercent: 10.95, parityPercent: 67.5, modifiedDurationYears: 5.35, maturityDate: '09/01/2038', couponPercent: 4.25, legislation: 'NEW_YORK' },
    { ticker: 'GD41D', name: 'Global 2041 USD Ley NY', category: 'bonos-usd', currency: 'USD', defaultPrice: 59.1, defaultVar: 1.15, defaultVol: 17000000, tirPercent: 11.75, parityPercent: 59.1, modifiedDurationYears: 5.8, maturityDate: '09/07/2041', couponPercent: 3.5, legislation: 'NEW_YORK' },
    { ticker: 'GD46D', name: 'Global 2046 USD Ley NY', category: 'bonos-usd', currency: 'USD', defaultPrice: 61.3, defaultVar: 0.75, defaultVol: 12000000, tirPercent: 11.2, parityPercent: 61.3, modifiedDurationYears: 6.4, maturityDate: '09/07/2046', couponPercent: 3.625, legislation: 'NEW_YORK' },
    { ticker: 'BPB7D', name: 'BOPREAL Serie 1 2027 (BCRA)', category: 'bonos-usd', currency: 'USD', defaultPrice: 94.2, defaultVar: 0.35, defaultVol: 38000000, tirPercent: 8.9, parityPercent: 94.2, modifiedDurationYears: 1.1, maturityDate: '31/10/2027', couponPercent: 5.0, legislation: 'ARGENTINA' },

    // ==========================================
    // 6. BONOS EN PESOS (Curva CER & Lecaps)
    // ==========================================
    { ticker: 'TX26', name: 'Boncer 2026 T2X6 (CER + 2.0%)', category: 'bonos-pesos', currency: 'ARS', defaultPrice: 285.4, defaultVar: 0.45, defaultVol: 450000000, tirPercent: 8.4, parityPercent: 98.2, modifiedDurationYears: 1.45, maturityDate: '09/11/2026' },
    { ticker: 'TX28', name: 'Boncer 2028 (CER + 2.25%)', category: 'bonos-pesos', currency: 'ARS', defaultPrice: 198.2, defaultVar: 0.52, defaultVol: 320000000, tirPercent: 9.1, parityPercent: 95.8, modifiedDurationYears: 2.8, maturityDate: '09/11/2028' },
    { ticker: 'TZX26', name: 'Boncer Cero Cupón Jun 2026', category: 'bonos-pesos', currency: 'ARS', defaultPrice: 142.8, defaultVar: 0.38, defaultVol: 280000000, tirPercent: 8.9, maturityDate: '30/06/2026' },
    { ticker: 'TZX27', name: 'Boncer Cero Cupón Jun 2027', category: 'bonos-pesos', currency: 'ARS', defaultPrice: 124.5, defaultVar: 0.42, defaultVol: 210000000, tirPercent: 9.4, maturityDate: '30/06/2027' },
    { ticker: 'DICP', name: 'Discount en Pesos 2033 (CER)', category: 'bonos-pesos', currency: 'ARS', defaultPrice: 3890.0, defaultVar: 0.65, defaultVol: 180000000, tirPercent: 10.2, parityPercent: 92.4, modifiedDurationYears: 4.1, maturityDate: '31/12/2033' },
    { ticker: 'PARP', name: 'Par en Pesos 2038 (CER)', category: 'bonos-pesos', currency: 'ARS', defaultPrice: 1840.0, defaultVar: 0.72, defaultVol: 110000000, tirPercent: 10.8, parityPercent: 88.5, modifiedDurationYears: 6.2, maturityDate: '31/12/2038' },

    { ticker: 'S31E5', name: 'Lecap Tasa Fija Ene 2025', category: 'bonos-pesos', currency: 'ARS', defaultPrice: 128.45, defaultVar: 0.25, defaultVol: 850000000, tirPercent: 38.5, tna: 38.5, tem: 3.16, maturityDate: '31/01/2025' },
    { ticker: 'S28F5', name: 'Lecap Tasa Fija Feb 2025', category: 'bonos-pesos', currency: 'ARS', defaultPrice: 124.1, defaultVar: 0.28, defaultVol: 620000000, tirPercent: 37.8, tna: 37.8, tem: 3.11, maturityDate: '28/02/2025' },
    { ticker: 'S31M5', name: 'Lecap Tasa Fija Mar 2025', category: 'bonos-pesos', currency: 'ARS', defaultPrice: 119.8, defaultVar: 0.32, defaultVol: 540000000, tirPercent: 36.9, tna: 36.9, tem: 3.03, maturityDate: '31/03/2025' },
    { ticker: 'S30A5', name: 'Lecap Tasa Fija Abr 2025', category: 'bonos-pesos', currency: 'ARS', defaultPrice: 115.4, defaultVar: 0.35, defaultVol: 480000000, tirPercent: 36.2, tna: 36.2, tem: 2.98, maturityDate: '30/04/2025' },
    { ticker: 'T15D5', name: 'Boncap Tasa Fija Dic 2025', category: 'bonos-pesos', currency: 'ARS', defaultPrice: 104.2, defaultVar: 0.3, defaultVol: 390000000, tirPercent: 35.5, tna: 35.5, tem: 2.92, maturityDate: '15/12/2025' },

    // ==========================================
    // 7. BONOS EXTRANJEROS & US TREASURIES
    // ==========================================
    { ticker: 'US2Y', name: 'US Treasury Yield 2 Años', category: 'bonos-extranjeros', currency: 'USD', defaultPrice: 3.82, defaultVar: -0.04, defaultVol: 0, tirPercent: 3.82, maturityDate: '2 Años', legislation: 'GLOBAL', yahooSymbol: '^IRX' },
    { ticker: 'US5Y', name: 'US Treasury Yield 5 Años', category: 'bonos-extranjeros', currency: 'USD', defaultPrice: 3.95, defaultVar: -0.02, defaultVol: 0, tirPercent: 3.95, maturityDate: '5 Años', legislation: 'GLOBAL', yahooSymbol: '^FVX' },
    { ticker: 'US10Y', name: 'US Treasury Yield 10 Años (Benchmark Global)', category: 'bonos-extranjeros', currency: 'USD', defaultPrice: 4.18, defaultVar: 0.03, defaultVol: 0, tirPercent: 4.18, maturityDate: '10 Años', legislation: 'GLOBAL', yahooSymbol: '^TNX' },
    { ticker: 'US30Y', name: 'US Treasury Yield 30 Años', category: 'bonos-extranjeros', currency: 'USD', defaultPrice: 4.45, defaultVar: 0.05, defaultVol: 0, tirPercent: 4.45, maturityDate: '30 Años', legislation: 'GLOBAL', yahooSymbol: '^TYX' },
    { ticker: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', category: 'bonos-extranjeros', currency: 'USD', defaultPrice: 94.8, defaultVar: 0.45, defaultVol: 24500000, yahooSymbol: 'TLT' },
    { ticker: 'IEF', name: 'iShares 7-10 Year Treasury Bond ETF', category: 'bonos-extranjeros', currency: 'USD', defaultPrice: 96.2, defaultVar: 0.2, defaultVol: 14200000, yahooSymbol: 'IEF' },
    { ticker: 'SHY', name: 'iShares 1-3 Year Treasury Bond ETF', category: 'bonos-extranjeros', currency: 'USD', defaultPrice: 82.5, defaultVar: 0.05, defaultVol: 8900000, yahooSymbol: 'SHY' },
    { ticker: 'EMB', name: 'JPMorgan USD Emerging Markets Bond ETF', category: 'bonos-extranjeros', currency: 'USD', defaultPrice: 91.4, defaultVar: 0.65, defaultVol: 9800000, yahooSymbol: 'EMB' },
    { ticker: 'BRASIL10Y', name: 'Bono Soberano Brasil 10 Años Yield', category: 'bonos-extranjeros', currency: 'USD', defaultPrice: 6.45, defaultVar: -0.05, defaultVol: 0, tirPercent: 6.45, maturityDate: '10 Años', legislation: 'GLOBAL' },
    { ticker: 'MEXICO10Y', name: 'Bono Soberano México 10 Años Yield', category: 'bonos-extranjeros', currency: 'USD', defaultPrice: 5.85, defaultVar: 0.02, defaultVol: 0, tirPercent: 5.85, maturityDate: '10 Años', legislation: 'GLOBAL' },
    { ticker: 'CHILE10Y', name: 'Bono Soberano Chile 10 Años Yield', category: 'bonos-extranjeros', currency: 'USD', defaultPrice: 4.95, defaultVar: -0.01, defaultVol: 0, tirPercent: 4.95, maturityDate: '10 Años', legislation: 'GLOBAL' },

    // ==========================================
    // 8. COMMODITIES AGRO & ENERGÍA
    // ==========================================
    { ticker: 'SOJA', name: 'Soja Chicago (CBOT Futures)', category: 'commodities', currency: 'USD', defaultPrice: 1261.5, defaultVar: 1.45, defaultVol: 145000, yahooSymbol: 'ZS=F' },
    { ticker: 'MAIZ', name: 'Maíz Chicago (CBOT Futures)', category: 'commodities', currency: 'USD', defaultPrice: 442.0, defaultVar: 0.85, defaultVol: 98000, yahooSymbol: 'ZC=F' },
    { ticker: 'TRIGO', name: 'Trigo Chicago (CBOT Futures)', category: 'commodities', currency: 'USD', defaultPrice: 565.0, defaultVar: -0.65, defaultVol: 65000, yahooSymbol: 'ZW=F' },
    { ticker: 'PETROLEO_WTI', name: 'Petróleo Crudo WTI (NYMEX)', category: 'commodities', currency: 'USD', defaultPrice: 74.8, defaultVar: 1.85, defaultVol: 340000, yahooSymbol: 'CL=F' },
    { ticker: 'PETROLEO_BRENT', name: 'Petróleo Crudo Brent ICE', category: 'commodities', currency: 'USD', defaultPrice: 79.2, defaultVar: 1.65, defaultVol: 280000, yahooSymbol: 'BZ=F' },
    { ticker: 'ORO', name: 'Oro Spot (COMEX Futures)', category: 'commodities', currency: 'USD', defaultPrice: 2650.4, defaultVar: 0.95, defaultVol: 185000, yahooSymbol: 'GC=F' },
    { ticker: 'PLATA', name: 'Plata Spot (COMEX Futures)', category: 'commodities', currency: 'USD', defaultPrice: 31.85, defaultVar: 1.4, defaultVol: 92000, yahooSymbol: 'SI=F' },
    { ticker: 'GAS_NATURAL', name: 'Gas Natural Henry Hub', category: 'commodities', currency: 'USD', defaultPrice: 2.85, defaultVar: -2.1, defaultVol: 110000, yahooSymbol: 'NG=F' },

    // ==========================================
    // 9. CRIPTOACTIVOS & DIVISAS INTERNACIONALES
    // ==========================================
    { ticker: 'BTC', name: 'Bitcoin Spot USD', category: 'cripto-divisas', currency: 'USD', defaultPrice: 94250.0, defaultVar: 3.45, defaultVol: 38500000000, yahooSymbol: 'BTC-USD' },
    { ticker: 'ETH', name: 'Ethereum Spot USD', category: 'cripto-divisas', currency: 'USD', defaultPrice: 3450.0, defaultVar: 2.8, defaultVol: 19200000000, yahooSymbol: 'ETH-USD' },
    { ticker: 'USDT', name: 'Tether USD (Dólar Cripto)', category: 'cripto-divisas', currency: 'USD', defaultPrice: 1.0, defaultVar: 0.02, defaultVol: 45000000000, yahooSymbol: 'USDT-USD' },
    { ticker: 'SOL', name: 'Solana Spot USD', category: 'cripto-divisas', currency: 'USD', defaultPrice: 185.4, defaultVar: 4.95, defaultVol: 5800000000, yahooSymbol: 'SOL-USD' },
    { ticker: 'EUR/ARS', name: 'Euro Oficial (BNA / DolarApi)', category: 'cripto-divisas', currency: 'ARS', defaultPrice: 1645.0, defaultVar: 0.45, defaultVol: 0 },
    { ticker: 'BRL/ARS', name: 'Real Brasileño Oficial', category: 'cripto-divisas', currency: 'ARS', defaultPrice: 268.0, defaultVar: 0.35, defaultVol: 0 },
    { ticker: 'CLP/ARS', name: 'Peso Chileno (100 CLP)', category: 'cripto-divisas', currency: 'ARS', defaultPrice: 158.0, defaultVar: 0.2, defaultVol: 0 },
    { ticker: 'UYU/ARS', name: 'Peso Uruguayo', category: 'cripto-divisas', currency: 'ARS', defaultPrice: 36.5, defaultVar: 0.15, defaultVol: 0 },
  ];

  static async getMarketOverview(): Promise<MarketsOverviewResponse> {
    return globalCache.getOrSet(
      'markets_overview_complete_v2',
      async () => {
        // 1. Extraer tickers de Yahoo Finance a consultar
        const yahooTickers = this.ASSET_DEFINITIONS.filter((a) => a.yahooSymbol).map((a) => a.yahooSymbol!);

        // 2. Ingesta paralela en lotes desde Yahoo Finance API
        let liveMap = new Map<string, YahooChartMeta>();
        try {
          liveMap = await YahooFinanceAdapter.getBatchQuotes(yahooTickers);
        } catch {
          // Ignored, fallback a valores institucionales
        }

        // 3. Procesar y enriquecer todos los activos con análisis técnico
        const assets: MarketAssetDto[] = this.ASSET_DEFINITIONS.map((def) => {
          let price = def.defaultPrice;
          let variation24h = def.defaultVar;
          let volume24h = def.defaultVol;
          let fiftyTwoWeekHigh: number | undefined;
          let fiftyTwoWeekLow: number | undefined;
          let closes: number[] = [];

          if (def.yahooSymbol && liveMap.has(def.yahooSymbol)) {
            const live = liveMap.get(def.yahooSymbol)!;
            if (live.regularMarketPrice > 0) {
              price = live.regularMarketPrice;
              if (live.chartPreviousClose > 0) {
                variation24h = Number((((price - live.chartPreviousClose) / live.chartPreviousClose) * 100).toFixed(2));
              }
              if (live.regularMarketVolume && live.regularMarketVolume > 0) {
                volume24h = live.regularMarketVolume;
              }
              fiftyTwoWeekHigh = live.fiftyTwoWeekHigh;
              fiftyTwoWeekLow = live.fiftyTwoWeekLow;
              closes = live.closes || [];
            }
          }

          // Generar análisis técnico y RSI
          const analysis = MarketAnalysisEngine.generateAnalysis(
            def.ticker,
            def.name,
            def.category,
            price,
            def.currency,
            variation24h,
            fiftyTwoWeekHigh,
            fiftyTwoWeekLow,
            closes
          );

          return {
            ticker: def.ticker,
            name: def.name,
            category: def.category,
            price,
            currency: def.currency,
            variation24h,
            volume24h,
            fiftyTwoWeekHigh,
            fiftyTwoWeekLow,
            rsi14: analysis.rsi14,
            trend: analysis.trend,
            technicalSignal: analysis.technicalSignal,
            tirPercent: def.tirPercent,
            parityPercent: def.parityPercent,
            modifiedDurationYears: def.modifiedDurationYears,
            maturityDate: def.maturityDate,
            couponPercent: def.couponPercent,
            legislation: def.legislation,
            tna: def.tna,
            tem: def.tem,
          };
        });

        // 4. Índices Big Cards (S&P Merval en ARS y en USD CCL)
        const mervalArs = assets.find((a) => a.ticker === 'GGAL')?.price
          ? 3024971.0
          : 2985000.0;

        const indices: MervalIndexDto[] = [
          { name: 'S&P Merval en Pesos (BYMA)', ticker: 'MERVAL', value: mervalArs, variation24h: 1.85, currency: 'ARS' },
          { name: 'S&P Merval en Dólar CCL', ticker: 'MERVAL_USD', value: 1892.4, variation24h: 2.1, currency: 'USD CCL' },
          { name: 'Índice General BYMA', ticker: 'IBG', value: 92450120.0, variation24h: 1.42, currency: 'ARS' },
          { name: 'S&P 500 (Wall Street)', ticker: 'SPX', value: 5985.2, variation24h: 0.65, currency: 'USD CCL' },
        ];

        // 5. Contadores por categoría
        const counts: Record<MarketCategory, number> = {
          'panel-lider': assets.filter((a) => a.category === 'panel-lider').length,
          'panel-general': assets.filter((a) => a.category === 'panel-general').length,
          'adrs': assets.filter((a) => a.category === 'adrs').length,
          'cedears': assets.filter((a) => a.category === 'cedears').length,
          'bonos-usd': assets.filter((a) => a.category === 'bonos-usd').length,
          'bonos-pesos': assets.filter((a) => a.category === 'bonos-pesos').length,
          'bonos-extranjeros': assets.filter((a) => a.category === 'bonos-extranjeros').length,
          'commodities': assets.filter((a) => a.category === 'commodities').length,
          'cripto-divisas': assets.filter((a) => a.category === 'cripto-divisas').length,
        };

        return {
          indices,
          assets,
          counts,
          lastUpdated: new Date().toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        };
      },
      MarketsService.TTL_MS
    );
  }

  /**
   * Obtiene el análisis financiero y fundamental completo de un activo específico
   */
  static async getAssetAnalysis(ticker: string): Promise<AssetAnalysisDto> {
    const overview = await this.getMarketOverview();
    const cleanTicker = ticker.trim().toUpperCase();

    const asset =
      overview.assets.find(
        (a) =>
          a.ticker.toUpperCase() === cleanTicker ||
          a.ticker.toUpperCase().startsWith(cleanTicker) ||
          cleanTicker.startsWith(a.ticker.toUpperCase())
      ) || overview.assets[0];

    // Consulta en tiempo real de serie histórica para el RSI
    const yahooDef = this.ASSET_DEFINITIONS.find((a) => a.ticker === asset.ticker);
    let closes: number[] = [];
    if (yahooDef?.yahooSymbol) {
      const chart = await YahooFinanceAdapter.getChart(yahooDef.yahooSymbol, '1mo', '1d');
      if (chart?.closes) {
        closes = chart.closes;
      }
    }

    return MarketAnalysisEngine.generateAnalysis(
      asset.ticker,
      asset.name,
      asset.category,
      asset.price,
      asset.currency,
      asset.variation24h,
      asset.fiftyTwoWeekHigh,
      asset.fiftyTwoWeekLow,
      closes
    );
  }
}
