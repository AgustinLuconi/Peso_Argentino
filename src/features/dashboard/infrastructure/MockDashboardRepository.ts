import {
  DashboardRepositoryPort,
  DashboardMetricsDto,
} from '../application/DashboardRepositoryPort';
import { MarketQuote } from '../domain/MarketQuote';
import { MacroKpi } from '../domain/MacroKpi';
import { TimeSeries } from '@core/domain/TimeSeries';

export class MockDashboardRepository implements DashboardRepositoryPort {
  async getDashboardMetrics(): Promise<DashboardMetricsDto> {
    const quotes: MarketQuote[] = [
      new MarketQuote({
        type: 'oficial',
        name: 'Dólar Oficial (BNA)',
        buyPrice: 1028.5,
        sellPrice: 1068.5,
        variation24h: 0.12,
        historicalSparkline: [1062, 1063.5, 1065, 1066, 1067.2, 1068.5],
        updatedAt: '15:00 hs',
      }),
      new MarketQuote({
        type: 'blue',
        name: 'Dólar Libre / Blue',
        buyPrice: 1200.0,
        sellPrice: 1220.0,
        variation24h: -0.81,
        historicalSparkline: [1235, 1230, 1225, 1225, 1220, 1220],
        updatedAt: '15:00 hs',
      }),
      new MarketQuote({
        type: 'mep',
        name: 'Dólar MEP (Bolsa AL30)',
        buyPrice: 1188.2,
        sellPrice: 1192.4,
        variation24h: 0.35,
        historicalSparkline: [1180, 1184, 1186, 1190, 1189, 1192.4],
        updatedAt: '15:00 hs',
      }),
      new MarketQuote({
        type: 'ccl',
        name: 'Contado con Liquidación (CCL)',
        buyPrice: 1212.0,
        sellPrice: 1218.9,
        variation24h: -0.24,
        historicalSparkline: [1225, 1222, 1220, 1218, 1221, 1218.9],
        updatedAt: '15:00 hs',
      }),
      new MarketQuote({
        type: 'cripto',
        name: 'Dólar Cripto (USDT/ARS)',
        buyPrice: 1210.5,
        sellPrice: 1215.0,
        variation24h: 0.08,
        historicalSparkline: [1210, 1212, 1214, 1213, 1215, 1215],
        updatedAt: '15:00 hs',
      }),
      new MarketQuote({
        type: 'tarjeta',
        name: 'Dólar Tarjeta / Turista',
        buyPrice: 1650.0,
        sellPrice: 1709.6,
        variation24h: 0.12,
        historicalSparkline: [1700, 1702, 1705, 1706, 1708, 1709.6],
        updatedAt: '15:00 hs',
      }),
      new MarketQuote({
        type: 'mayorista',
        name: 'Dólar Mayorista (A3500)',
        buyPrice: 1045.0,
        sellPrice: 1048.0,
        variation24h: 0.15,
        historicalSparkline: [1042, 1043, 1044.5, 1046, 1047, 1048],
        updatedAt: '15:00 hs',
      }),
    ];

    const kpis: MacroKpi[] = [
      new MacroKpi({
        id: 'reservas-bcra',
        title: 'Reservas Brutas BCRA',
        value: 'US$ 30.412 M',
        numericValue: 30412,
        unit: 'USD M',
        variation: 0.45,
        period: 'vs día anterior',
        historicalSeries: [29800, 29950, 30100, 30250, 30310, 30412],
        category: 'monetary',
        statusNote: 'Saldo positivo por compras netas en MULC',
      }),
      new MacroKpi({
        id: 'riesgo-pais',
        title: 'Riesgo País (EMBI+)',
        value: '738 bps',
        numericValue: 738,
        unit: 'bps',
        variation: -1.6,
        period: 'vs cierre previo',
        historicalSeries: [820, 795, 780, 765, 750, 738],
        category: 'debt',
        statusNote: 'Mínimo en 5 años impulsado por compresión de TIR bonos',
      }),
      new MacroKpi({
        id: 'inflacion-mensual',
        title: 'Inflación Mensual (INDEC)',
        value: '2,20%',
        numericValue: 2.2,
        unit: '%',
        variation: -0.5,
        period: 'Último registro publicado',
        historicalSeries: [4.2, 4.0, 3.5, 2.7, 2.4, 2.2],
        category: 'prices',
        statusNote: 'Tendencia desinflacionaria sostenida',
      }),
      new MacroKpi({
        id: 'tasa-politica',
        title: 'Tasa Política LEFI (BCRA)',
        value: '32,00% TNA',
        numericValue: 32.0,
        unit: '% TNA',
        variation: 0.0,
        period: 'Tasa de referencia',
        historicalSeries: [40, 35, 35, 32, 32, 32],
        category: 'monetary',
        statusNote: 'Traspaso de pasivos remunerados al Tesoro concluido',
      }),
      new MacroKpi({
        id: 'superavit-fiscal',
        title: 'Superávit Fiscal Financiero',
        value: '+$ 518.408 M',
        numericValue: 518408,
        unit: 'ARS M',
        variation: 3.2,
        period: 'Base Caja Acumulado',
        historicalSeries: [320000, 390000, 440000, 480000, 502000, 518408],
        category: 'fiscal',
        statusNote: 'Superávit primario y financiero consecutivo',
      }),
      new MacroKpi({
        id: 'brecha-promedio',
        title: 'Brecha Cambiaria (CCL vs Of.)',
        value: '14,08%',
        numericValue: 14.08,
        unit: '%',
        variation: -0.38,
        period: 'Diferencial spot',
        historicalSeries: [21.5, 19.8, 18.2, 16.5, 15.1, 14.08],
        category: 'monetary',
        statusNote: 'Mínimo de brecha en el programa de estabilización',
      }),
    ];

    const breachHistory = new TimeSeries('Evolución de Brecha Cambiaria', '%', [
      { timestamp: 'Ene', value: 24.5, label: 'Enero' },
      { timestamp: 'Feb', value: 21.0, label: 'Febrero' },
      { timestamp: 'Mar', value: 19.2, label: 'Marzo' },
      { timestamp: 'Abr', value: 17.8, label: 'Abril' },
      { timestamp: 'May', value: 16.4, label: 'Mayo' },
      { timestamp: 'Jun', value: 15.0, label: 'Junio' },
      { timestamp: 'Jul', value: 14.5, label: 'Julio' },
      { timestamp: 'Ago', value: 14.08, label: 'Agosto' },
    ]);

    return {
      quotes,
      kpis,
      breachHistory,
      lastUpdated: new Date().toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  }

  async getDollarQuoteByType(type: string): Promise<MarketQuote | null> {
    const metrics = await this.getDashboardMetrics();
    return metrics.quotes.find((q) => q.type === type) || null;
  }
}
