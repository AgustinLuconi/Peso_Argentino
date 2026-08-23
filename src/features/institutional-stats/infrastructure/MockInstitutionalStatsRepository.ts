import {
  InstitutionalStatsRepositoryPort,
  InstitutionalStatsDto,
} from '../application/InstitutionalStatsRepositoryPort';
import { BcraBalanceSheet } from '../domain/BcraBalanceSheet';
import { InterestRateMetric } from '../domain/InterestRateMetric';
import { TimeSeries } from '@core/domain/TimeSeries';

export class MockInstitutionalStatsRepository
  implements InstitutionalStatsRepositoryPort
{
  async getInstitutionalStats(): Promise<InstitutionalStatsDto> {
    const balanceSheet = new BcraBalanceSheet({
      grossReservesUsd: 30412000000,
      netReservesUsd: 3850000000,
      monetaryBaseArs: 24850000000000,
      circulatingCashArs: 16200000000000,
      bankReservesArs: 8650000000000,
      lefiTreasuryArs: 12100000000000,
      pasesBcraArs: 0,
      privateDepositsArs: 48900000000000,
      privateDepositsUsd: 31400000000,
      lastUpdated: 'Informe Monetario Diario BCRA',
    });

    const rates: InterestRateMetric[] = [
      new InterestRateMetric({
        id: 'lefi',
        name: 'Tasa Política Monetaria (LEFI Tesoro)',
        tna: 32.0,
        tea: 37.14,
        tem: 2.63,
        type: 'policy',
        description: 'Tasa de referencia del sistema financiero administrada por el Tesoro',
      }),
      new InterestRateMetric({
        id: 'badlar',
        name: 'Tasa BADLAR Bancos Privados',
        tna: 32.8,
        tea: 38.2,
        tem: 2.7,
        type: 'interbank',
        description: 'Promedio ponderado de depósitos superiores a $1M en bancos privados',
      }),
      new InterestRateMetric({
        id: 'plazo-fijo',
        name: 'Plazo Fijo Tradicional (30 Días)',
        tna: 30.5,
        tea: 35.18,
        tem: 2.51,
        type: 'deposits',
        description: 'Tasa media del sistema bancario para colocaciones a plazo fijo en pesos',
      }),
      new InterestRateMetric({
        id: 'caucion',
        name: 'Caución Bursátil (1 Día en BYMA)',
        tna: 28.5,
        tea: 32.95,
        tem: 2.34,
        type: 'market',
        description: 'Tasa de colocación garantizada por activos del mercado de capitales',
      }),
      new InterestRateMetric({
        id: 'tm20',
        name: 'Tasa TM20 (Depósitos Mayoristas)',
        tna: 33.1,
        tea: 38.65,
        tem: 2.72,
        type: 'interbank',
        description: 'Tasa de depósitos a plazo de $20M o más',
      }),
    ];

    const series = {
      inflationIndec: new TimeSeries('Inflación Mensual INDEC', '%', [
        { timestamp: 'Ene', value: 20.6, label: 'Enero 20.6%' },
        { timestamp: 'Feb', value: 13.2, label: 'Febrero 13.2%' },
        { timestamp: 'Mar', value: 11.0, label: 'Marzo 11.0%' },
        { timestamp: 'Abr', value: 8.8, label: 'Abril 8.8%' },
        { timestamp: 'May', value: 4.2, label: 'Mayo 4.2%' },
        { timestamp: 'Jun', value: 4.6, label: 'Junio 4.6%' },
        { timestamp: 'Jul', value: 4.0, label: 'Julio 4.0%' },
        { timestamp: 'Ago', value: 4.2, label: 'Agosto 4.2%' },
        { timestamp: 'Sep', value: 3.5, label: 'Septiembre 3.5%' },
        { timestamp: 'Oct', value: 2.7, label: 'Octubre 2.7%' },
        { timestamp: 'Nov', value: 2.4, label: 'Noviembre 2.4%' },
        { timestamp: 'Dic', value: 2.2, label: 'Diciembre 2.2%' },
      ]),
      monetaryBaseSeries: new TimeSeries('Base Monetaria Ampliada', '$ B', [
        { timestamp: 'Ene', value: 10.5, label: 'Enero $10.5 B' },
        { timestamp: 'Feb', value: 11.8, label: 'Febrero $11.8 B' },
        { timestamp: 'Mar', value: 13.2, label: 'Marzo $13.2 B' },
        { timestamp: 'Abr', value: 15.0, label: 'Abril $15.0 B' },
        { timestamp: 'May', value: 16.8, label: 'Mayo $16.8 B' },
        { timestamp: 'Jun', value: 18.9, label: 'Junio $18.9 B' },
        { timestamp: 'Jul', value: 21.0, label: 'Julio $21.0 B' },
        { timestamp: 'Ago', value: 22.3, label: 'Agosto $22.3 B' },
        { timestamp: 'Sep', value: 23.4, label: 'Septiembre $23.4 B' },
        { timestamp: 'Oct', value: 24.1, label: 'Octubre $24.1 B' },
        { timestamp: 'Nov', value: 24.6, label: 'Noviembre $24.6 B' },
        { timestamp: 'Dic', value: 24.85, label: 'Diciembre $24.85 B' },
      ]),
      grossReservesSeries: new TimeSeries('Reservas Internacionales BCRA', 'USD M', [
        { timestamp: 'Ene', value: 24500, label: 'Enero US$ 24.500 M' },
        { timestamp: 'Feb', value: 26200, label: 'Febrero US$ 26.200 M' },
        { timestamp: 'Mar', value: 27100, label: 'Marzo US$ 27.100 M' },
        { timestamp: 'Abr', value: 28200, label: 'Abril US$ 28.200 M' },
        { timestamp: 'May', value: 28900, label: 'Mayo US$ 28.900 M' },
        { timestamp: 'Jun', value: 29300, label: 'Junio US$ 29.300 M' },
        { timestamp: 'Jul', value: 29500, label: 'Julio US$ 29.500 M' },
        { timestamp: 'Ago', value: 29800, label: 'Agosto US$ 29.800 M' },
        { timestamp: 'Sep', value: 30100, label: 'Septiembre US$ 30.100 M' },
        { timestamp: 'Oct', value: 30250, label: 'Octubre US$ 30.250 M' },
        { timestamp: 'Nov', value: 30412, label: 'Noviembre US$ 30.412 M' },
        { timestamp: 'Dic', value: 30480, label: 'Diciembre US$ 30.480 M' },
      ]),
      tradeBalanceSeries: new TimeSeries('Balanza Comercial Mensual', 'USD M', [
        { timestamp: 'Ene', value: 797, label: 'Enero US$ +797 M' },
        { timestamp: 'Feb', value: 1438, label: 'Febrero US$ +1.438 M' },
        { timestamp: 'Mar', value: 2059, label: 'Marzo US$ +2.059 M' },
        { timestamp: 'Abr', value: 1820, label: 'Abril US$ +1.820 M' },
        { timestamp: 'May', value: 2656, label: 'Mayo US$ +2.656 M' },
        { timestamp: 'Jun', value: 1911, label: 'Junio US$ +1.911 M' },
        { timestamp: 'Jul', value: 1530, label: 'Julio US$ +1.530 M' },
        { timestamp: 'Ago', value: 1480, label: 'Agosto US$ +1.480 M' },
        { timestamp: 'Sep', value: 1390, label: 'Septiembre US$ +1.390 M' },
        { timestamp: 'Oct', value: 1250, label: 'Octubre US$ +1.250 M' },
        { timestamp: 'Nov', value: 1180, label: 'Noviembre US$ +1.180 M' },
        { timestamp: 'Dic', value: 1450, label: 'Diciembre US$ +1.450 M' },
      ]),
    };

    return {
      balanceSheet,
      rates,
      series,
      tradeBalanceSummary: {
        exportsUsd: 68200000000,
        importsUsd: 53700000000,
        surplusUsd: 14500000000,
        period: 'Acumulado Anual INDEC',
      },
    };
  }
}
