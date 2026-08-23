import { serverCache } from './cache';

export interface DeputyItem {
  nombre: string;
  apellido: string;
  distrito: string;
  bloque: string;
  inicioMandato: string;
  finMandato: string;
}

export class PoliticalService {
  private static readonly TTL_POLITICAL = 60 * 60 * 1000; // 1 hour

  static async getDeputies(): Promise<DeputyItem[]> {
    return serverCache.getOrFetch('political_deputies', async () => {
      try {
        const res = await fetch('https://api.argly.com.ar/v1/diputados');
        if (!res.ok) throw new Error(`Argly diputados status ${res.status}`);
        const json = await res.json();
        const list = json?.data || [];

        return list.map((d: any) => ({
          nombre: d.nombre,
          apellido: d.apellido,
          distrito: d.distrito,
          bloque: d.bloque,
          inicioMandato: d.inicio_mandato,
          finMandato: d.fin_mandato,
        }));
      } catch (e) {
        console.error('[PoliticalService] Deputies error:', e);
        return [];
      }
    }, PoliticalService.TTL_POLITICAL);
  }
}
