import { globalCache } from '../../core/cache/MemoryCache';
import { HttpClient } from '../../core/http/HttpClient';

export interface BankRateDto {
  entidad: string;
  tnaClientes: number;
  tnaNoClientes: number;
  enlace: string;
}

export interface WalletYieldDto {
  name: string;
  tna: number;
  tem: number;
  type: 'fintech' | 'bank_fci';
}

export class RatesService {
  private static readonly TTL_MS = 60 * 60 * 1000; // 1 hour

  static async getPlazosFijos(): Promise<BankRateDto[]> {
    return globalCache.getOrSet(
      'rates_plazos_fijos_v1',
      async () => {
        try {
          const raw = await HttpClient.get<any[]>('https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo');
          if (Array.isArray(raw)) {
            return raw.map((item) => ({
              entidad: item.entidad || 'Banco',
              tnaClientes: typeof item.tnaClientes === 'number' ? item.tnaClientes * 100 : 30,
              tnaNoClientes: typeof item.tnaNoClientes === 'number' ? item.tnaNoClientes * 100 : 30,
              enlace: item.enlace || '#',
            }));
          }
        } catch (e) {
          console.warn('[RatesService] Error fetching ArgentinaDatos plazo fijo:', e);
        }

        return [
          { entidad: 'BANCO DE LA NACION ARGENTINA', tnaClientes: 30.0, tnaNoClientes: 30.0, enlace: '#' },
          { entidad: 'BANCO SANTANDER ARGENTINA S.A.', tnaClientes: 28.0, tnaNoClientes: 28.0, enlace: '#' },
          { entidad: 'BANCO GALICIA Y BUENOS AIRES S.A.U.', tnaClientes: 31.0, tnaNoClientes: 31.0, enlace: '#' },
          { entidad: 'BANCO BBVA ARGENTINA S.A.', tnaClientes: 29.5, tnaNoClientes: 29.5, enlace: '#' },
          { entidad: 'BANCO MACRO S.A.', tnaClientes: 32.0, tnaNoClientes: 32.0, enlace: '#' },
          { entidad: 'BANCO CREDICOOP COOPERATIVO LIMITADO', tnaClientes: 31.0, tnaNoClientes: 31.0, enlace: '#' },
        ];
      },
      RatesService.TTL_MS
    );
  }

  static async getWallets(): Promise<WalletYieldDto[]> {
    return globalCache.getOrSet(
      'rates_wallets_v1',
      async () => {
        return [
          { name: 'Mercado Pago (FCI Bapro)', tna: 28.4, tem: 2.33, type: 'fintech' },
          { name: 'Personal Pay (FCI Delta)', tna: 31.2, tem: 2.56, type: 'fintech' },
          { name: 'Ualá (Ualintec FCI)', tna: 30.5, tem: 2.51, type: 'fintech' },
          { name: 'Naranja X (Cuenta Remunerada)', tna: 33.0, tem: 2.71, type: 'fintech' },
          { name: 'Prex (FCI Allaria)', tna: 29.8, tem: 2.45, type: 'fintech' },
        ];
      },
      RatesService.TTL_MS
    );
  }
}
