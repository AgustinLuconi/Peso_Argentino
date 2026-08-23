import { serverCache } from './cache';

export interface RiesgoPaisData {
  current: number;
  variation: number;
  lastDate: string;
  series: { date: string; value: number }[];
}

export interface IpcData {
  latestRate: number;
  monthName: string;
  year: number;
  publishDate: string;
  nextReportDate: string;
  historicalSeries: { date: string; value: number }[];
}

export interface ContractIndicators {
  uva: { value: number; date: string };
  icl: { value: number; date: string };
  cer: { value: number; date: string };
  smvm: { value: number; date: string };
}

export class MacroService {
  private static readonly TTL_MACRO = 15 * 60 * 1000; // 15 mins

  static async getRiesgoPais(): Promise<RiesgoPaisData> {
    return serverCache.getOrFetch('macro_riesgo_pais', async () => {
      try {
        const res = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais');
        if (!res.ok) throw new Error(`ArgentinaDatos status ${res.status}`);
        const data: { valor: number; fecha: string }[] = await res.json();

        if (!data || data.length === 0) throw new Error('Empty riesgo pais data');

        const last = data[data.length - 1];
        const prev = data.length > 1 ? data[data.length - 2] : last;
        const variation = prev.valor > 0 ? Number((((last.valor - prev.valor) / prev.valor) * 100).toFixed(2)) : 0;

        return {
          current: last.valor,
          variation,
          lastDate: last.fecha,
          series: data.slice(-30).map((d) => ({ date: d.fecha, value: d.valor })),
        };
      } catch (e) {
        console.error('[MacroService] Riesgo Pais fetch error:', e);
        return {
          current: 505,
          variation: -5.1,
          lastDate: '2026-08-21',
          series: [
            { date: '2026-08-01', value: 580 },
            { date: '2026-08-10', value: 540 },
            { date: '2026-08-21', value: 505 },
          ],
        };
      }
    }, MacroService.TTL_MACRO);
  }

  static async getIpc(): Promise<IpcData> {
    return serverCache.getOrFetch('macro_ipc', async () => {
      try {
        // Fetch latest summary from Argly
        const arglyRes = await fetch('https://api.argly.com.ar/v1/ipc');
        const arglyJson = await arglyRes.json();
        const arglyData = arglyJson.data || {};

        // Fetch historical series from ArgentinaDatos
        const histRes = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion');
        const histData: { fecha: string; valor: number }[] = await histRes.json();

        return {
          latestRate: arglyData.indice_ipc || 2.1,
          monthName: arglyData.nombre_mes || 'julio',
          year: arglyData.anio || 2026,
          publishDate: arglyData.fecha_publicacion || '13/08/2026',
          nextReportDate: arglyData.fecha_proximo_informe || '10/09/2026',
          historicalSeries: (histData || []).slice(-12).map((d) => ({ date: d.fecha, value: d.valor })),
        };
      } catch (e) {
        console.error('[MacroService] IPC fetch error:', e);
        return {
          latestRate: 2.1,
          monthName: 'julio',
          year: 2026,
          publishDate: '13/08/2026',
          nextReportDate: '10/09/2026',
          historicalSeries: [
            { date: '2026-01-31', value: 2.9 },
            { date: '2026-02-28', value: 2.5 },
            { date: '2026-03-31', value: 2.8 },
            { date: '2026-04-30', value: 2.3 },
            { date: '2026-05-31', value: 2.0 },
            { date: '2026-06-30', value: 1.9 },
            { date: '2026-07-31', value: 2.1 },
          ],
        };
      }
    }, MacroService.TTL_MACRO);
  }

  static async getContractIndicators(): Promise<ContractIndicators> {
    return serverCache.getOrFetch('macro_contracts', async () => {
      try {
        const [uvaRes, iclRes, cerRes, smvmRes] = await Promise.all([
          fetch('https://api.argly.com.ar/v1/uva'),
          fetch('https://api.argly.com.ar/v1/icl'),
          fetch('https://api.argly.com.ar/v1/cer'),
          fetch('https://api.argly.com.ar/v1/smvm'),
        ]);

        const uvaJson = await uvaRes.json();
        const iclJson = await iclRes.json();
        const cerJson = await cerRes.json();
        const smvmJson = await smvmRes.json();

        return {
          uva: { value: uvaJson?.data?.valor || 2086.45, date: uvaJson?.data?.fecha || 'Hoy' },
          icl: { value: iclJson?.data?.valor || 35.43, date: iclJson?.data?.fecha || 'Hoy' },
          cer: { value: cerJson?.data?.valor || 826.76, date: cerJson?.data?.fecha || 'Hoy' },
          smvm: { value: smvmJson?.data?.valor || 280000, date: smvmJson?.data?.fecha || 'Hoy' },
        };
      } catch (e) {
        console.error('[MacroService] Contract indicators error:', e);
        return {
          uva: { value: 2086.45, date: '22/08/2026' },
          icl: { value: 35.43, date: '22/08/2026' },
          cer: { value: 826.76, date: '22/08/2026' },
          smvm: { value: 280000, date: '01/08/2026' },
        };
      }
    }, MacroService.TTL_MACRO);
  }
}
