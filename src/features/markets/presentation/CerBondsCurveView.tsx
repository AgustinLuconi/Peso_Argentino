import React, { useState, useMemo } from 'react';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { PageHeader } from '@core/ui/components/PageHeader';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export interface CerBondItem {
  ticker: string;
  name: string;
  type: 'BONO CER' | 'LEFI / TASA FIJA';
  maturityYear: number;
  maturityDate: string;
  lastPrice: number; // En ARS
  realYield: number; // Tasa Real sobre CER (% anual)
  parity: number; // Paridad (%)
  spreadInflation: number; // Spread sobre inflación en p.p.
  modifiedDuration: number;
}

export const CER_BONDS_DATA: CerBondItem[] = [
  {
    ticker: 'TX26',
    name: 'Bonos del Tesoro Ajustables por CER 2026',
    type: 'BONO CER',
    maturityYear: 2026,
    maturityDate: '09/11/2026',
    lastPrice: 194.5,
    realYield: 6.85,
    parity: 96.2,
    spreadInflation: 6.85,
    modifiedDuration: 1.6,
  },
  {
    ticker: 'TZX26',
    name: 'Bono Cero Cupón Ajustable por CER 2026',
    type: 'BONO CER',
    maturityYear: 2026.5,
    maturityDate: '30/06/2026',
    lastPrice: 182.0,
    realYield: 7.20,
    parity: 95.8,
    spreadInflation: 7.20,
    modifiedDuration: 1.3,
  },
  {
    ticker: 'TZX27',
    name: 'Bono Cero Cupón Ajustable por CER 2027',
    type: 'BONO CER',
    maturityYear: 2027,
    maturityDate: '30/06/2027',
    lastPrice: 164.2,
    realYield: 8.45,
    parity: 94.1,
    spreadInflation: 8.45,
    modifiedDuration: 2.2,
  },
  {
    ticker: 'TX28',
    name: 'Bonos del Tesoro Ajustables por CER 2028',
    type: 'BONO CER',
    maturityYear: 2028,
    maturityDate: '09/11/2028',
    lastPrice: 178.5,
    realYield: 9.10,
    parity: 92.5,
    spreadInflation: 9.10,
    modifiedDuration: 3.4,
  },
  {
    ticker: 'TZX28',
    name: 'Bono Cero Cupón Ajustable por CER 2028',
    type: 'BONO CER',
    maturityYear: 2028.5,
    maturityDate: '15/12/2028',
    lastPrice: 151.0,
    realYield: 9.60,
    parity: 91.2,
    spreadInflation: 9.60,
    modifiedDuration: 3.7,
  },
  {
    ticker: 'DICP',
    name: 'Bono Discount en Pesos con CER 2033',
    type: 'BONO CER',
    maturityYear: 2033,
    maturityDate: '31/12/2033',
    lastPrice: 4250.0,
    realYield: 10.85,
    parity: 88.4,
    spreadInflation: 10.85,
    modifiedDuration: 5.6,
  },
  {
    ticker: 'PARP',
    name: 'Bono Par en Pesos con CER 2038',
    type: 'BONO CER',
    maturityYear: 2038,
    maturityDate: '31/12/2038',
    lastPrice: 2890.0,
    realYield: 11.40,
    parity: 79.5,
    spreadInflation: 11.40,
    modifiedDuration: 8.2,
  },
];

export const CerBondsCurveView: React.FC = () => {
  const [selectedTicker, setSelectedTicker] = useState<string>('TX26');

  const selectedBond = useMemo(() => {
    return CER_BONDS_DATA.find((b) => b.ticker === selectedTicker) || CER_BONDS_DATA[0];
  }, [selectedTicker]);

  // SVG Chart Setup
  const svgWidth = 850;
  const svgHeight = 240;
  const padLeft = 60;
  const padRight = 50;
  const padTop = 30;
  const padBottom = 45;

  const chartInnerWidth = svgWidth - padLeft - padRight;
  const chartInnerHeight = svgHeight - padTop - padBottom;

  const minYear = 2025.5;
  const maxYear = 2039;
  const yearRange = maxYear - minYear;

  const minYield = 5.0;
  const maxYield = 13.0;
  const yieldRange = maxYield - minYield;

  const points = CER_BONDS_DATA.map((b) => {
    const x = padLeft + ((b.maturityYear - minYear) / yearRange) * chartInnerWidth;
    const y = padTop + chartInnerHeight - ((b.realYield - minYield) / yieldRange) * chartInnerHeight;
    return { ...b, x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${padTop + chartInnerHeight} L ${points[0].x},${padTop + chartInnerHeight} Z`;

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header Banner */}
      <PageHeader
        title="Curva de Bonos en Pesos & Rendimiento Real CER"
        subtitle="Estructura de Tasa Real positiva por encima de la variación del IPC/CER. Monitoreo de TIR Real en pesos, paridades de mercado y protección del poder adquisitivo contra la inflación."
        badgeText="COBERTURA INFLACIONARIA"
        badgeVariant="emerald"
        actions={
          <div className="p-3 bg-surface-container-low dark:bg-[#131822] rounded-xl border border-surface-container-highest dark:border-[#1E2638] text-right shadow-xs">
            <div className="text-[10px] font-sans text-outline dark:text-slate-400 uppercase font-semibold">Tasa Real Promedio</div>
            <div className="text-lg sm:text-xl font-bold font-sans text-emerald-600 dark:text-emerald-400">CER + 8.9%</div>
            <div className="text-[10px] font-sans text-outline dark:text-slate-400">Protección del 100% de IPC</div>
          </div>
        }
      />

      {/* SVG Real Yield Curve Chart */}
      <Card variant="default" accent="gold" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container-highest pb-3">
          <div>
            <h3 className="font-h2 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              Curva de Tasa Real (TIR % sobre Inflación vs Vencimiento)
            </h3>
            <p className="font-subtitle text-xs">
              Rendimiento neto real asegurado sobre el Coeficiente de Estabilización de Referencia (CER)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans text-emerald-600 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            Curva CER Real Positiva
          </div>
        </div>

        <div className="relative overflow-x-auto bg-surface-container-lowest p-3 rounded-2xl border border-surface-container-highest">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-60 sm:h-64 select-none overflow-visible"
          >
            <defs>
              <linearGradient id="cerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[5, 7, 9, 11, 13].map((val) => {
              const yVal = padTop + chartInnerHeight - ((val - minYield) / yieldRange) * chartInnerHeight;
              return (
                <g key={val}>
                  <line
                    x1={padLeft}
                    y1={yVal}
                    x2={svgWidth - padRight}
                    y2={yVal}
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padLeft - 10}
                    y={yVal + 4}
                    textAnchor="end"
                    className="text-[10px] font-sans fill-slate-400 font-semibold"
                  >
                    CER+{val}%
                  </text>
                </g>
              );
            })}

            {/* Year Grid */}
            {[2026, 2027, 2028, 2030, 2033, 2038].map((yr) => {
              const xVal = padLeft + ((yr - minYear) / yearRange) * chartInnerWidth;
              return (
                <g key={yr}>
                  <line
                    x1={xVal}
                    y1={padTop}
                    x2={xVal}
                    y2={padTop + chartInnerHeight}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                  />
                  <text
                    x={xVal}
                    y={padTop + chartInnerHeight + 20}
                    textAnchor="middle"
                    className="text-[10px] font-sans fill-slate-400 font-bold"
                  >
                    {yr}
                  </text>
                </g>
              );
            })}

            {/* Gradient Area */}
            <path d={areaD} fill="url(#cerGradient)" />

            {/* Main CER Curve Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {points.map((pt) => {
              const isSelected = pt.ticker === selectedTicker;
              return (
                <g
                  key={pt.ticker}
                  onClick={() => setSelectedTicker(pt.ticker)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? '6.5' : '4.5'}
                    fill={isSelected ? '#10B981' : '#047857'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-transform group-hover:scale-125"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    className={`text-[9px] font-sans font-bold ${
                      isSelected ? 'fill-emerald-600 font-black text-xs' : 'fill-primary'
                    }`}
                  >
                    {pt.ticker}: +{pt.realYield}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </Card>

      {/* Selected CER Bond Sheet & Full Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-surface-container-highest shadow-tactile space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-sans font-bold text-base text-primary">
                  {selectedBond.ticker}
                </h4>
                <Badge variant="bullish" size="sm">
                  CER + {selectedBond.realYield}%
                </Badge>
              </div>
              <p className="text-xs font-sans text-on-surface-variant truncate">
                {selectedBond.name}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-[10px] font-sans text-outline block">Tasa Real Neta</span>
                <span className="text-base font-bold font-sans text-emerald-600">+{selectedBond.realYield}%</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-[10px] font-sans text-outline block">Paridad</span>
                <span className="text-base font-bold font-sans text-primary">{selectedBond.parity}%</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-[10px] font-sans text-outline block">Vencimiento</span>
                <span className="text-xs font-bold font-sans text-primary">{selectedBond.maturityDate}</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-[10px] font-sans text-outline block">Duración</span>
                <span className="text-base font-bold font-sans text-primary">{selectedBond.modifiedDuration} años</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-[11px] font-sans text-emerald-950 flex items-start gap-2">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Este título ajusta su capital diariamente por el coeficiente CER (INDEC). Garantiza cobertura total de inflación más una tasa adicional de <strong>+{selectedBond.realYield}% anual</strong>.
              </span>
            </div>
          </div>
        </div>

        {/* Full Table */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-surface-container-highest shadow-tactile space-y-3">
          <div className="border-b border-surface-container-highest pb-3">
            <h4 className="font-sans font-bold text-sm text-primary">
              Cuadro Integral de Títulos Ajustables por CER
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-surface-container-highest text-[10px] font-sans uppercase text-outline">
                  <th className="pb-2">Ticker</th>
                  <th className="pb-2">Tipo</th>
                  <th className="pb-2">Vencimiento</th>
                  <th className="pb-2">TIR Real (%)</th>
                  <th className="pb-2">Paridad (%)</th>
                  <th className="pb-2">Duración</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/60">
                {CER_BONDS_DATA.map((b) => {
                  const isSel = selectedTicker === b.ticker;
                  return (
                    <tr
                      key={b.ticker}
                      onClick={() => setSelectedTicker(b.ticker)}
                      className={`cursor-pointer transition-colors ${
                        isSel ? 'bg-emerald-50/70 font-bold' : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <td className="py-2.5 font-bold text-primary">{b.ticker}</td>
                      <td className="py-2.5">
                        <Badge variant="navy" size="sm">
                          {b.type}
                        </Badge>
                      </td>
                      <td className="py-2.5 font-sans text-on-surface-variant">{b.maturityDate}</td>
                      <td className="py-2.5 font-sans text-emerald-600 font-bold">CER + {b.realYield.toFixed(2)}%</td>
                      <td className="py-2.5 font-sans text-primary">{b.parity.toFixed(1)}%</td>
                      <td className="py-2.5 font-sans text-outline">{b.modifiedDuration} años</td>
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
