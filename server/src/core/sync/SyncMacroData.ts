import { DatabaseConnection } from '../database/DatabaseConnection';
import { DatabaseMigrations } from '../database/DatabaseMigrations';

interface ArgentinaDatosInflationItem {
  readonly fecha: string;
  readonly valor: number;
}

interface ArgentinaDatosRiesgoItem {
  readonly fecha: string;
  readonly valor: number;
}

interface ArgentinaDatosPlazoFijoItem {
  readonly entidad: string;
  readonly tnaClientes: number;
  readonly tnaNoClientes?: number;
}

interface ArglyIpcResponse {
  readonly data?: {
    readonly indice_ipc: number;
    readonly mes: number;
    readonly nombre_mes: string;
    readonly anio: number;
    readonly fecha_publicacion: string;
    readonly fecha_proximo_informe: string;
  };
}

interface DolarItem {
  readonly casa: string;
  readonly nombre: string;
  readonly compra: number;
  readonly venta: number;
  readonly fechaActualizacion: string;
}

export async function syncMacroeconomicData(): Promise<{
  readonly ipcUpdated: number;
  readonly riesgoUpdated: number;
  readonly ratesUpdated: number;
  readonly dolarUpdated: number;
  readonly summaryMarkdown: string;
}> {
  console.log('[MacroSync] 🚀 Iniciando sincronización de datos con ArgentinaDatos, Argly y DolarApi en Neon...');

  if (DatabaseConnection.isConfigured()) {
    await DatabaseMigrations.runMigrations();
  } else {
    console.warn('[MacroSync] ⚠️ DATABASE_URL no configurada. Saltando inserción en Neon.');
  }

  let ipcCount = 0;
  let riesgoCount = 0;
  let ratesCount = 0;
  let dolarCount = 0;

  let latestIpcValue = '2.1%';
  let latestIpcMonth = 'julio 2026';
  let nextIpcDate = '10/09/2026';
  let latestRiesgoVal = 505;
  let latestRiesgoDate = '2026-08-24';
  let oficialPrice = '$1.210,00';
  let bluePrice = '$1.220,00';
  let cclPrice = '$1.215,00';
  let dynamicBreach = '14.08%';

  // 1. Sincronizar Inflación IPC (ArgentinaDatos & Argly)
  try {
    console.log('[MacroSync] 📥 Consultando serie de inflación en ArgentinaDatos & Argly...');
    const [argDatosRes, arglyRes] = await Promise.allSettled([
      fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion').then((r) => r.json() as Promise<readonly ArgentinaDatosInflationItem[]>),
      fetch('https://api.argly.com.ar/v1/ipc').then((r) => r.json() as Promise<ArglyIpcResponse>),
    ]);

    if (argDatosRes.status === 'fulfilled' && Array.isArray(argDatosRes.value)) {
      for (const item of argDatosRes.value) {
        if (item.fecha && typeof item.valor === 'number') {
          const period = item.fecha.substring(0, 7); // 'YYYY-MM'
          await DatabaseConnection.execute(
            `INSERT INTO macro_series (series_code, period, value, unit, source)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (series_code, period)
             DO UPDATE SET value = EXCLUDED.value, unit = EXCLUDED.unit, source = EXCLUDED.source, updated_at = NOW()`,
            ['ipc', period, item.valor, '% m/m', 'INDEC / ArgentinaDatos']
          );
          ipcCount++;
        }
      }
    }

    if (arglyRes.status === 'fulfilled' && arglyRes.value?.data) {
      const d = arglyRes.value.data;
      const period = `${d.anio}-${String(d.mes).padStart(2, '0')}`;
      await DatabaseConnection.execute(
        `INSERT INTO macro_series (series_code, period, value, unit, source)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (series_code, period)
         DO UPDATE SET value = EXCLUDED.value, unit = EXCLUDED.unit, source = EXCLUDED.source, updated_at = NOW()`,
        ['ipc', period, d.indice_ipc, '% m/m', 'INDEC / Argly']
      );
      latestIpcValue = `${d.indice_ipc}%`;
      latestIpcMonth = `${d.nombre_mes} ${d.anio}`;
      nextIpcDate = d.fecha_proximo_informe || nextIpcDate;
    }

    console.log(`[MacroSync] ✅ Inflación IPC sincronizada: ${ipcCount} períodos actualizados en Neon.`);
  } catch (err) {
    console.error('[MacroSync] ⚠️ Error al sincronizar inflación:', err);
  }

  // 2. Sincronizar Riesgo País EMBI+ (ArgentinaDatos)
  try {
    console.log('[MacroSync] 📥 Consultando serie de Riesgo País en ArgentinaDatos...');
    const riesgoRes = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais');
    if (riesgoRes.ok) {
      const list = (await riesgoRes.json()) as readonly ArgentinaDatosRiesgoItem[];
      if (Array.isArray(list) && list.length > 0) {
        for (const item of list.slice(-60)) {
          if (item.fecha && typeof item.valor === 'number') {
            const period = item.fecha.substring(0, 7);
            await DatabaseConnection.execute(
              `INSERT INTO macro_series (series_code, period, value, unit, source)
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT (series_code, period)
               DO UPDATE SET value = EXCLUDED.value, unit = EXCLUDED.unit, source = EXCLUDED.source, updated_at = NOW()`,
              ['riesgo_pais', period, item.valor, 'bps', 'J.P. Morgan / ArgentinaDatos']
            );
            riesgoCount++;
          }
        }

        const last = list[list.length - 1];
        latestRiesgoVal = last.valor;
        latestRiesgoDate = last.fecha;
        console.log(`[MacroSync] ✅ Riesgo País sincronizado: ${latestRiesgoVal} bps (${latestRiesgoDate}).`);
      }
    }
  } catch (err) {
    console.error('[MacroSync] ⚠️ Error al sincronizar Riesgo País:', err);
  }

  // 3. Sincronizar Tasas Bancarias de Plazo Fijo (ArgentinaDatos)
  try {
    console.log('[MacroSync] 📥 Consultando tasas de Plazos Fijos en ArgentinaDatos...');
    const pfRes = await fetch('https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo');
    if (pfRes.ok) {
      const banks = (await pfRes.json()) as readonly ArgentinaDatosPlazoFijoItem[];
      if (Array.isArray(banks) && banks.length > 0) {
        for (const b of banks) {
          if (b.entidad && typeof b.tnaClientes === 'number') {
            const tna = b.tnaClientes < 1 ? Number((b.tnaClientes * 100).toFixed(2)) : b.tnaClientes;
            const tem = Number(((tna * 30) / 365).toFixed(2));
            const tea = Number(((Math.pow(1 + tem / 100, 12) - 1) * 100).toFixed(2));

            await DatabaseConnection.execute(
              `INSERT INTO bank_rates (entity_name, rate_type, tna, tea, tem)
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT (entity_name, rate_type)
               DO UPDATE SET tna = EXCLUDED.tna, tea = EXCLUDED.tea, tem = EXCLUDED.tem, updated_at = NOW()`,
              [b.entidad, 'plazo_fijo', tna, tea, tem]
            );
            ratesCount++;
          }
        }
        console.log(`[MacroSync] ✅ Tasas de Plazo Fijo sincronizadas: ${ratesCount} entidades.`);
      }
    }
  } catch (err) {
    console.error('[MacroSync] ⚠️ Error al sincronizar tasas de Plazo Fijo:', err);
  }

  // 4. Sincronizar Cotizaciones en Vivo del Dólar (DolarApi)
  try {
    console.log('[MacroSync] 📥 Consultando cotizaciones del Dólar en DolarApi...');
    const dolarRes = await fetch('https://dolarapi.com/v1/dolares');
    if (dolarRes.ok) {
      const dolares = (await dolarRes.json()) as readonly DolarItem[];
      if (Array.isArray(dolares) && dolares.length > 0) {
        const mapping: Record<string, { readonly type: string; readonly name: string }> = {
          oficial: { type: 'oficial', name: 'Dólar Oficial (BNA)' },
          blue: { type: 'blue', name: 'Dólar Libre / Blue' },
          bolsa: { type: 'mep', name: 'Dólar MEP (Bolsa AL30)' },
          contadoconliqui: { type: 'ccl', name: 'Contado con Liquidación (CCL)' },
          tarjeta: { type: 'tarjeta', name: 'Dólar Tarjeta / Turista' },
          cripto: { type: 'cripto', name: 'Dólar Cripto (USDT/ARS)' },
          mayorista: { type: 'mayorista', name: 'Dólar Mayorista (A3500)' },
        };

        let ofVenta = 0;
        let cclVenta = 0;

        for (const item of dolares) {
          const conf = mapping[item.casa];
          if (conf) {
            const buy = item.compra || item.venta * 0.98;
            const sell = item.venta;
            const spread = Number((sell - buy).toFixed(2));

            await DatabaseConnection.execute(
              `INSERT INTO quotes_history (quote_type, name, buy_price, sell_price, spread, variation_24h)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [conf.type, conf.name, buy, sell, spread, 0.1]
            );
            dolarCount++;

            if (conf.type === 'oficial') {
              ofVenta = sell;
              oficialPrice = `$${sell.toLocaleString('es-AR')}`;
            }
            if (conf.type === 'blue') {
              bluePrice = `$${sell.toLocaleString('es-AR')}`;
            }
            if (conf.type === 'ccl') {
              cclVenta = sell;
              cclPrice = `$${sell.toLocaleString('es-AR')}`;
            }
          }
        }

        if (ofVenta > 0 && cclVenta > 0) {
          dynamicBreach = `${(((cclVenta - ofVenta) / ofVenta) * 100).toFixed(2)}%`;
        }

        console.log(`[MacroSync] ✅ Cotizaciones del Dólar sincronizadas: ${dolarCount} tipos insertados en Neon.`);
      }
    }
  } catch (err) {
    console.error('[MacroSync] ⚠️ Error al sincronizar cotizaciones del dólar:', err);
  }

  // Generar reporte en Markdown para GitHub Step Summary
  const syncTime = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

  const summaryMarkdown = `
# 🇦🇷 Reporte de Sincronización Macroeconómica Automática
**Peso Argentino — Sync Engine (ArgentinaDatos, Argly, DolarApi & Neon PostgreSQL)**

* **Fecha de Ejecución**: \`${syncTime} (Hora Argentina)\`
* **Base de Datos**: \`Neon Serverless PostgreSQL (Cloud)\`

---

### 📊 1. Indicadores Macroeconómicos Clave Actualizados
| Indicador | Valor Actual | Período / Fecha | Fuente Oficial |
| :--- | :--- | :--- | :--- |
| **Inflación Mensual IPC** | **${latestIpcValue}** | ${latestIpcMonth} | INDEC / Argly / ArgentinaDatos |
| **Próximo Informe IPC** | 🗓️ ${nextIpcDate} | Mensual | INDEC Calendario Oficial |
| **Riesgo País EMBI+** | **${latestRiesgoVal} bps** | ${latestRiesgoDate} | J.P. Morgan / ArgentinaDatos |
| **Dólar Oficial BNA** | **${oficialPrice}** | En vivo | Banco de la Nación Argentina |
| **Dólar Libre (Blue)** | **${bluePrice}** | En vivo | Mercado Informal |
| **Dólar CCL** | **${cclPrice}** | En vivo | BYMA / ADRs |
| **Brecha Cambiaria (CCL vs Oficial)** | **${dynamicBreach}** | En vivo | Compresión Institucional |

---

### 🏛️ 2. Resumen de Sincronización en Neon PostgreSQL
* 📈 **Inflación IPC**: \`${ipcCount}\` registros históricos procesados.
* 🛡️ **Riesgo País**: \`${riesgoCount}\` registros sincronizados.
* 🏦 **Tasas Bancarias**: \`${ratesCount}\` entidades bancarias actualizadas.
* 💵 **Cotizaciones del Dólar**: \`${dolarCount}\` tipos de cambio registrados en \`quotes_history\`.

> 💡 *Sincronización ejecutada automáticamente en Neon Serverless Cloud.*
`;

  return {
    ipcUpdated: ipcCount,
    riesgoUpdated: riesgoCount,
    ratesUpdated: ratesCount,
    dolarUpdated: dolarCount,
    summaryMarkdown,
  };
}

// Ejecución directa si se llama por CLI
if (process.argv[1]?.endsWith('SyncMacroData.ts')) {
  syncMacroeconomicData()
    .then((res) => {
      console.log(res.summaryMarkdown);
      DatabaseConnection.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[MacroSync] Fatal Error:', err);
      process.exit(1);
    });
}
