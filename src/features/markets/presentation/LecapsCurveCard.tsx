import React, { useState } from 'react';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { Button } from '@core/ui/components/Button';
import { TrendingUp, Calculator, Calendar, ArrowUpRight, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { Money } from '@core/domain/Money';

export interface LecapAsset {
  ticker: string;
  name: string;
  type: 'LECAP' | 'BONCAP';
  maturityDate: string;
  daysToMaturity: number;
  lastPrice: number;
  tem: number; // Tasa Efectiva Mensual (%)
  tna: number; // Tasa Nominal Anual (%)
  tea: number; // Tasa Efectiva Anual (%)
  directYield: number; // Rendimiento directo al vencimiento (%)
  expectedInflation: number; // Inflación proyectada al vencimiento (%)
  spreadInflation: number; // Spread sobre inflación en p.p.
}

const LECAPS_CURVE_DATA: LecapAsset[] = [
  {
    ticker: 'S31E5',
    name: 'Lecap Capitalizable Enero 2025',
    type: 'LECAP',
    maturityDate: '31/01/2025',
    daysToMaturity: 15,
    lastPrice: 139.2,
    tem: 3.55,
    tna: 43.2,
    tea: 52.8,
    directYield: 1.85,
    expectedInflation: 1.4,
    spreadInflation: 0.45,
  },
  {
    ticker: 'S28F5',
    name: 'Lecap Capitalizable Febrero 2025',
    type: 'LECAP',
    maturityDate: '28/02/2025',
    daysToMaturity: 43,
    lastPrice: 134.8,
    tem: 3.65,
    tna: 44.4,
    tea: 54.7,
    directYield: 5.25,
    expectedInflation: 4.1,
    spreadInflation: 1.15,
  },
  {
    ticker: 'S31M5',
    name: 'Lecap Capitalizable Marzo 2025',
    type: 'LECAP',
    maturityDate: '31/03/2025',
    daysToMaturity: 74,
    lastPrice: 130.4,
    tem: 3.72,
    tna: 45.2,
    tea: 56.1,
    directYield: 9.35,
    expectedInflation: 7.2,
    spreadInflation: 2.15,
  },
  {
    ticker: 'S30A5',
    name: 'Lecap Capitalizable Abril 2025',
    type: 'LECAP',
    maturityDate: '30/04/2025',
    daysToMaturity: 104,
    lastPrice: 126.1,
    tem: 3.80,
    tna: 46.2,
    tea: 57.8,
    directYield: 13.60,
    expectedInflation: 10.4,
    spreadInflation: 3.20,
  },
  {
    ticker: 'S30M5',
    name: 'Lecap Capitalizable Mayo 2025',
    type: 'LECAP',
    maturityDate: '30/05/2025',
    daysToMaturity: 134,
    lastPrice: 122.5,
    tem: 3.88,
    tna: 47.1,
    tea: 59.4,
    directYield: 17.85,
    expectedInflation: 13.8,
    spreadInflation: 4.05,
  },
  {
    ticker: 'S30J5',
    name: 'Lecap Capitalizable Junio 2025',
    type: 'LECAP',
    maturityDate: '30/06/2025',
    daysToMaturity: 165,
    lastPrice: 118.9,
    tem: 3.92,
    tna: 47.6,
    tea: 60.3,
    directYield: 22.30,
    expectedInflation: 17.2,
    spreadInflation: 5.10,
  },
  {
    ticker: 'S18J5',
    name: 'Lecap Capitalizable Julio 2025',
    type: 'LECAP',
    maturityDate: '18/07/2025',
    daysToMaturity: 183,
    lastPrice: 116.8,
    tem: 3.95,
    tna: 48.0,
    tea: 61.1,
    directYield: 25.10,
    expectedInflation: 19.4,
    spreadInflation: 5.70,
  },
  {
    ticker: 'S15A5',
    name: 'Lecap Capitalizable Agosto 2025',
    type: 'LECAP',
    maturityDate: '15/08/2025',
    daysToMaturity: 211,
    lastPrice: 113.6,
    tem: 3.98,
    tna: 48.4,
    tea: 61.8,
    directYield: 29.40,
    expectedInflation: 22.8,
    spreadInflation: 6.60,
  },
  {
    ticker: 'S12S5',
    name: 'Lecap Capitalizable Septiembre 2025',
    type: 'LECAP',
    maturityDate: '12/09/2025',
    daysToMaturity: 239,
    lastPrice: 110.5,
    tem: 4.02,
    tna: 48.9,
    tea: 62.7,
    directYield: 33.80,
    expectedInflation: 26.2,
    spreadInflation: 7.60,
  },
  {
    ticker: 'S17O5',
    name: 'Lecap Capitalizable Octubre 2025',
    type: 'LECAP',
    maturityDate: '17/10/2025',
    daysToMaturity: 274,
    lastPrice: 107.2,
    tem: 4.05,
    tna: 49.3,
    tea: 63.5,
    directYield: 38.90,
    expectedInflation: 30.5,
    spreadInflation: 8.40,
  },
  {
    ticker: 'S28N5',
    name: 'Lecap Capitalizable Noviembre 2025',
    type: 'LECAP',
    maturityDate: '28/11/2025',
    daysToMaturity: 316,
    lastPrice: 103.4,
    tem: 4.08,
    tna: 49.6,
    tea: 64.2,
    directYield: 45.30,
    expectedInflation: 35.8,
    spreadInflation: 9.50,
  },
  {
    ticker: 'S15D5',
    name: 'Lecap Capitalizable Diciembre 2025',
    type: 'LECAP',
    maturityDate: '15/12/2025',
    daysToMaturity: 333,
    lastPrice: 101.5,
    tem: 4.10,
    tna: 49.9,
    tea: 64.8,
    directYield: 48.20,
    expectedInflation: 38.1,
    spreadInflation: 10.10,
  },
  {
    ticker: 'T15D5',
    name: 'Boncap Tasa Fija Diciembre 2025',
    type: 'BONCAP',
    maturityDate: '15/12/2025',
    daysToMaturity: 333,
    lastPrice: 101.2,
    tem: 4.12,
    tna: 50.1,
    tea: 65.2,
    directYield: 48.90,
    expectedInflation: 38.1,
    spreadInflation: 10.80,
  },
];

export const LecapsCurveCard: React.FC = () => {
  const [selectedLecap, setSelectedLecap] = useState<LecapAsset>(LECAPS_CURVE_DATA[2]); // S31M5 por defecto
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000000); // 1 Millón ARS

  // Cálculos de rendimiento
  const totalReturnDirect = (investmentAmount * selectedLecap.directYield) / 100;
  const finalCapital = investmentAmount + totalReturnDirect;
  const monthlyEstimatedReturn = (investmentAmount * selectedLecap.tem) / 100;

  // Max TEM para escalar el gráfico visual
  const maxTem = Math.max(...LECAPS_CURVE_DATA.map((l) => l.tem));
  const minTem = Math.min(...LECAPS_CURVE_DATA.map((l) => l.tem));

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header Banner de Lecaps */}
      <div className="bg-gradient-to-r from-primary to-primary-container text-white p-5 sm:p-6 rounded-2xl border border-primary/20 shadow-tactile flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-gold/20 text-gold rounded-lg">
              <TrendingUp size={20} />
            </span>
            <h2 className="text-xl font-bold font-sans text-white">
              Curva de Rendimientos Lecaps & Boncaps del Tesoro
            </h2>
            <Badge variant="gold" size="sm">
              TASA FIJA EN PESOS
            </Badge>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Estructura temporal de tasas de interés (ETTI) de Letras y Bonos Capitalizables emitidos por la Secretaría de Finanzas. Monitoreo de Tasa Efectiva Mensual (TEM), TNA, TEA y spread de tasa real contra el REM.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 bg-black/30 backdrop-blur-md rounded-xl border border-white/10 text-right">
            <div className="text-[10px] font-mono text-slate-300 uppercase">TEM Promedio Curva</div>
            <div className="text-lg font-bold font-mono text-gold">3.88% m/m</div>
            <div className="text-[10px] font-mono text-bullish-green font-semibold">TEA: ~59.2%</div>
          </div>
        </div>
      </div>

      {/* Visual Yield Curve (Chart) */}
      <Card variant="default" accent="gold" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container-highest pb-3">
          <div>
            <h3 className="font-h2 flex items-center gap-2">
              <TrendingUp size={16} className="text-gold" />
              Estructura Temporal de Tasas (TEM % vs Plazo en Días)
            </h3>
            <p className="font-subtitle text-xs">
              Haz clic en cualquier punto de la curva para simular rendimientos y ver la ficha técnica
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 text-primary">
              <span className="w-2.5 h-2.5 rounded-full bg-gold inline-block"></span>
              TEM Mensual
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest inline-block"></span>
              Vencimiento
            </span>
          </div>
        </div>

        {/* CSS Chart Bar / Yield Curve */}
        <div className="pt-4 pb-2">
          <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-13 gap-2 items-end h-48 bg-surface-container-low/50 p-3 rounded-xl border border-surface-container-highest">
            {LECAPS_CURVE_DATA.map((lecap) => {
              const isSelected = selectedLecap.ticker === lecap.ticker;
              const heightPercent = 40 + ((lecap.tem - minTem) / (maxTem - minTem || 1)) * 55;

              return (
                <button
                  key={lecap.ticker}
                  onClick={() => setSelectedLecap(lecap)}
                  className="flex flex-col items-center justify-end h-full group focus:outline-none"
                  title={`${lecap.ticker} - TEM: ${lecap.tem}% - Vto: ${lecap.maturityDate}`}
                >
                  <div className="text-[10px] font-mono font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                    {lecap.tem}%
                  </div>

                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-200 flex items-end justify-center pb-1 ${
                      isSelected
                        ? 'bg-gold shadow-md ring-2 ring-gold/50'
                        : 'bg-primary/80 group-hover:bg-primary group-hover:scale-105'
                    }`}
                  >
                    <span className="text-[8px] font-mono text-white font-bold rotate-[-90deg] sm:rotate-0 truncate">
                      {lecap.tem}%
                    </span>
                  </div>

                  <div className="mt-2 text-center">
                    <span
                      className={`text-[10px] font-sans font-bold block truncate ${
                        isSelected ? 'text-gold' : 'text-on-surface'
                      }`}
                    >
                      {lecap.ticker}
                    </span>
                    <span className="text-[9px] font-mono text-outline block">
                      {lecap.daysToMaturity}d
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Simulator & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Simulator */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-surface-container-highest shadow-tactile space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container-highest pb-3">
            <span className="p-1.5 bg-gold/10 text-gold rounded-lg">
              <Calculator size={18} />
            </span>
            <div>
              <h4 className="font-sans font-bold text-sm text-primary">
                Simulador de Rendimiento Lecap
              </h4>
              <p className="text-[11px] font-sans text-on-surface-variant">
                Calcula la ganancia directa al vencimiento
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-sans font-semibold text-on-surface mb-1">
                Letra Seleccionada
              </label>
              <select
                value={selectedLecap.ticker}
                onChange={(e) => {
                  const found = LECAPS_CURVE_DATA.find((l) => l.ticker === e.target.value);
                  if (found) setSelectedLecap(found);
                }}
                className="w-full p-2.5 bg-surface-container-low border border-surface-container-high rounded-xl text-xs font-sans font-bold text-primary focus:outline-none focus:border-gold"
              >
                {LECAPS_CURVE_DATA.map((l) => (
                  <option key={l.ticker} value={l.ticker}>
                    {l.ticker} — Vto: {l.maturityDate} ({l.daysToMaturity} días) — TEM: {l.tem}%
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold text-on-surface mb-1">
                Monto a Invertir en Pesos ($ ARS)
              </label>
              <input
                type="number"
                step="50000"
                min="1000"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value) || 0)}
                className="w-full p-2.5 bg-surface-container-low border border-surface-container-high rounded-xl text-sm font-mono font-bold text-primary focus:outline-none focus:border-gold"
              />
            </div>

            {/* Simulation Results Card */}
            <div className="p-4 bg-surface-container-lowest border border-surface-container-highest rounded-xl space-y-2.5">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-on-surface-variant">Capital Inicial:</span>
                <span className="font-mono font-bold text-primary">
                  {Money.formatArs(investmentAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-on-surface-variant">Rendimiento Directo ({selectedLecap.directYield}%):</span>
                <span className="font-mono font-bold text-bullish-green">
                  +{Money.formatArs(totalReturnDirect)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-on-surface-variant">Ganancia Mensual Est. (TEM {selectedLecap.tem}%):</span>
                <span className="font-mono font-semibold text-primary">
                  ~{Money.formatArs(monthlyEstimatedReturn)} /mes
                </span>
              </div>

              <div className="pt-2 border-t border-surface-container flex justify-between items-center text-sm font-sans">
                <span className="font-bold text-primary">Monto Final al Vto:</span>
                <span className="font-mono font-black text-gold text-base">
                  {Money.formatArs(finalCapital)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 border border-blue-200/50 rounded-xl text-[11px] font-sans text-blue-900 flex items-start gap-2">
              <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <span>
                Las Lecaps capitalizan intereses mensualmente. Al vencimiento el Tesoro abona $100 más toda la tasa acumulada libre de retenciones.
              </span>
            </div>
          </div>
        </div>

        {/* Selected Lecap Full Technical Sheet */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-surface-container-highest shadow-tactile space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container-highest pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-sans font-bold text-base text-primary">
                  Ficha Técnica & Métricas: {selectedLecap.ticker}
                </h4>
                <Badge variant="navy" size="sm">
                  {selectedLecap.type}
                </Badge>
              </div>
              <p className="text-xs font-sans text-on-surface-variant">
                {selectedLecap.name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="bullish" size="sm">
                Spread Real: +{selectedLecap.spreadInflation} p.p.
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className="text-[10px] font-mono text-outline uppercase block">TEM Mensual</span>
              <span className="text-lg font-bold font-mono text-primary">{selectedLecap.tem}%</span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className="text-[10px] font-mono text-outline uppercase block">TNA Efectiva</span>
              <span className="text-lg font-bold font-mono text-primary">{selectedLecap.tna}%</span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className="text-[10px] font-mono text-outline uppercase block">TEA Compuesta</span>
              <span className="text-lg font-bold font-mono text-gold">{selectedLecap.tea}%</span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className="text-[10px] font-mono text-outline uppercase block">Plazo al Vto</span>
              <span className="text-lg font-bold font-mono text-primary">{selectedLecap.daysToMaturity} días</span>
            </div>
          </div>

          {/* Full Lecaps Comparison Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-surface-container-highest text-[10px] font-mono uppercase text-outline">
                  <th className="pb-2 font-semibold">Letra / Ticker</th>
                  <th className="pb-2 font-semibold">Vencimiento</th>
                  <th className="pb-2 font-semibold">Días</th>
                  <th className="pb-2 font-semibold">Precio Spot</th>
                  <th className="pb-2 font-semibold">TEM (%)</th>
                  <th className="pb-2 font-semibold">TNA (%)</th>
                  <th className="pb-2 font-semibold">TEA (%)</th>
                  <th className="pb-2 font-semibold">Rend. Directo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/60">
                {LECAPS_CURVE_DATA.map((l) => {
                  const isSel = selectedLecap.ticker === l.ticker;
                  return (
                    <tr
                      key={l.ticker}
                      onClick={() => setSelectedLecap(l)}
                      className={`cursor-pointer transition-colors ${
                        isSel
                          ? 'bg-gold/10 font-bold'
                          : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <td className="py-2.5 font-bold text-primary flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSel ? 'bg-gold' : 'bg-transparent'}`}></span>
                        {l.ticker}
                      </td>
                      <td className="py-2.5 font-mono text-on-surface-variant">{l.maturityDate}</td>
                      <td className="py-2.5 font-mono text-outline">{l.daysToMaturity}d</td>
                      <td className="py-2.5 font-mono text-primary">${l.lastPrice.toFixed(2)}</td>
                      <td className="py-2.5 font-mono text-gold font-bold">{l.tem.toFixed(2)}%</td>
                      <td className="py-2.5 font-mono text-primary">{l.tna.toFixed(1)}%</td>
                      <td className="py-2.5 font-mono text-primary font-semibold">{l.tea.toFixed(1)}%</td>
                      <td className="py-2.5 font-mono text-bullish-green font-bold">+{l.directYield.toFixed(2)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
