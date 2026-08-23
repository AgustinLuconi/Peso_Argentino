import { globalCache } from '../../core/cache/MemoryCache';

export interface MarketAssetDto {
  ticker: string;
  name: string;
  category: 'merval' | 'adrs' | 'bonds' | 'lecaps';
  price: number;
  currency: 'ARS' | 'USD';
  variation24h: number;
  volume24h: number;
  tirPercent?: number;
  parityPercent?: number;
  modifiedDurationYears?: number;
  maturityDate?: string;
}

export interface MervalIndexDto {
  name: string;
  ticker: string;
  value: number;
  variation24h: number;
  currency: 'ARS' | 'USD CCL';
}

export class MarketsService {
  private static readonly TTL_MS = 60 * 1000; // 1 min

  static async getMarketOverview() {
    return globalCache.getOrSet(
      'markets_overview_v1',
      async () => {
        const indices: MervalIndexDto[] = [
          { name: 'S&P Merval en Pesos', ticker: 'MERVAL', value: 2185420.5, variation24h: 1.85, currency: 'ARS' },
          { name: 'S&P Merval en Dólar CCL', ticker: 'MERVAL_USD', value: 1792.8, variation24h: 2.1, currency: 'USD CCL' },
          { name: 'Índice General BYMA', ticker: 'IBG', value: 89450120.0, variation24h: 1.42, currency: 'ARS' },
        ];

        const assets: MarketAssetDto[] = [
          // Panel Líder Merval
          { ticker: 'GGAL', name: 'Grupo Financiero Galicia', category: 'merval', price: 6150.0, currency: 'ARS', variation24h: 2.35, volume24h: 1850000000 },
          { ticker: 'YPFD', name: 'YPF S.A.', category: 'merval', price: 38200.0, currency: 'ARS', variation24h: 3.12, volume24h: 2410000000 },
          { ticker: 'PAMP', name: 'Pampa Energía S.A.', category: 'merval', price: 3450.0, currency: 'ARS', variation24h: 1.65, volume24h: 1200000000 },
          { ticker: 'BMA', name: 'Banco Macro S.A.', category: 'merval', price: 9200.0, currency: 'ARS', variation24h: -0.45, volume24h: 980000000 },
          { ticker: 'TXAR', name: 'Ternium Argentina S.A.', category: 'merval', price: 1120.0, currency: 'ARS', variation24h: 0.85, volume24h: 650000000 },
          { ticker: 'CEPU', name: 'Central Puerto S.A.', category: 'merval', price: 1350.0, currency: 'ARS', variation24h: 1.95, volume24h: 540000000 },

          // ADRs Wall Street
          { ticker: 'GGAL (ADR)', name: 'Galicia ADR NYSE', category: 'adrs', price: 50.45, currency: 'USD', variation24h: 2.85, volume24h: 18500000 },
          { ticker: 'YPF (ADR)', name: 'YPF ADR NYSE', category: 'adrs', price: 31.25, currency: 'USD', variation24h: 3.45, volume24h: 28400000 },
          { ticker: 'BMA (ADR)', name: 'Banco Macro ADR NYSE', category: 'adrs', price: 75.8, currency: 'USD', variation24h: -0.25, volume24h: 9200000 },
          { ticker: 'PAM (ADR)', name: 'Pampa Energía ADR NYSE', category: 'adrs', price: 68.2, currency: 'USD', variation24h: 1.9, volume24h: 12100000 },
          { ticker: 'TGS (ADR)', name: 'Transportadora Gas Sur NYSE', category: 'adrs', price: 24.15, currency: 'USD', variation24h: 2.15, volume24h: 6500000 },

          // Bonos Soberanos USD
          { ticker: 'AL30D', name: 'Bono Rep. Arg. USD 2030 L. Arg', category: 'bonds', price: 72.85, currency: 'USD', variation24h: 1.15, volume24h: 32000000, tirPercent: 11.45, parityPercent: 72.85, modifiedDurationYears: 2.15, maturityDate: '09/07/2030' },
          { ticker: 'GD30D', name: 'Bono Rep. Arg. USD 2030 L. NY', category: 'bonds', price: 77.4, currency: 'USD', variation24h: 0.95, volume24h: 41000000, tirPercent: 10.25, parityPercent: 77.4, modifiedDurationYears: 2.22, maturityDate: '09/07/2030' },
          { ticker: 'AL35D', name: 'Bono Rep. Arg. USD 2035 L. Arg', category: 'bonds', price: 58.2, currency: 'USD', variation24h: 1.45, volume24h: 14000000, tirPercent: 12.1, parityPercent: 58.2, modifiedDurationYears: 4.85, maturityDate: '09/07/2035' },
          { ticker: 'GD35D', name: 'Bono Rep. Arg. USD 2035 L. NY', category: 'bonds', price: 63.8, currency: 'USD', variation24h: 1.25, volume24h: 19500000, tirPercent: 11.3, parityPercent: 63.8, modifiedDurationYears: 4.92, maturityDate: '09/07/2035' },

          // Lecaps ARS
          { ticker: 'S31E5', name: 'Letra del Tesoro ARS Ene 2025', category: 'lecaps', price: 128.45, currency: 'ARS', variation24h: 0.25, volume24h: 850000000, tirPercent: 38.5, maturityDate: '31/01/2025' },
          { ticker: 'S28F5', name: 'Letra del Tesoro ARS Feb 2025', category: 'lecaps', price: 124.1, currency: 'ARS', variation24h: 0.28, volume24h: 620000000, tirPercent: 37.8, maturityDate: '28/02/2025' },
          { ticker: 'S31M5', name: 'Letra del Tesoro ARS Mar 2025', category: 'lecaps', price: 119.8, currency: 'ARS', variation24h: 0.32, volume24h: 540000000, tirPercent: 36.9, maturityDate: '31/03/2025' },
        ];

        return { indices, assets };
      },
      MarketsService.TTL_MS
    );
  }
}
