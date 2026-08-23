import { serverCache } from './cache';

export interface BankRateItem {
  entidad: string;
  logo: string | null;
  tnaClientes: number;
  tnaNoClientes: number;
}

export interface WalletYieldItem {
  entidad: string;
  rendimiento: number;
  fecha: string;
}

export class RatesService {
  private static readonly TTL_RATES = 30 * 60 * 1000; // 30 mins

  static async getPlazosFijos(): Promise<BankRateItem[]> {
    return serverCache.getOrFetch('rates_plazos_fijos', async () => {
      try {
        const res = await fetch('https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo');
        if (!res.ok) throw new Error(`Plazo Fijo status ${res.status}`);
        const data = await res.json();
        return (data || []).map((item: any) => ({
          entidad: item.entidad,
          logo: item.logo,
          tnaClientes: Number((item.tnaClientes * 100).toFixed(2)),
          tnaNoClientes: Number((item.tnaNoClientes * 100).toFixed(2)),
        }));
      } catch (e) {
        console.error('[RatesService] Plazos Fijos fetch error:', e);
        return [
          { entidad: 'BANCO DE LA NACION ARGENTINA', logo: null, tnaClientes: 37.0, tnaNoClientes: 37.0 },
          { entidad: 'BANCO SANTANDER ARGENTINA S.A.', logo: null, tnaClientes: 35.0, tnaNoClientes: 35.0 },
          { entidad: 'BANCO GALICIA Y BUENOS AIRES S.A.U.', logo: null, tnaClientes: 36.0, tnaNoClientes: 36.0 },
          { entidad: 'BBVA ARGENTINA S.A.', logo: null, tnaClientes: 35.5, tnaNoClientes: 35.5 },
        ];
      }
    }, RatesService.TTL_RATES);
  }

  static async getWalletYields(): Promise<WalletYieldItem[]> {
    return serverCache.getOrFetch('rates_wallets', async () => {
      try {
        const res = await fetch('https://api.argentinadatos.com/v1/finanzas/tasas/rendimientos');
        if (!res.ok) throw new Error(`Wallet yields status ${res.status}`);
        const data = await res.json();
        return (data || []).map((item: any) => ({
          entidad: item.entidad,
          rendimiento: Number((item.rendimiento * 100).toFixed(2)),
          fecha: item.fecha,
        }));
      } catch (e) {
        console.error('[RatesService] Wallets fetch error:', e);
        return [
          { entidad: 'Mercado Pago', rendimiento: 35.2, fecha: '2026-08-22' },
          { entidad: 'Personal Pay', rendimiento: 37.1, fecha: '2026-08-22' },
          { entidad: 'Naranja X', rendimiento: 40.0, fecha: '2026-08-22' },
          { entidad: 'Ualá', rendimiento: 36.5, fecha: '2026-08-22' },
        ];
      }
    }, RatesService.TTL_RATES);
  }
}
