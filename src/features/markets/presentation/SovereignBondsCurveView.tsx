import React, { useState, useMemo } from 'react';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { Button } from '@core/ui/components/Button';
import { Money } from '@core/domain/Money';
import {
  TrendingUp,
  Shield,
  Layers,
  Scale,
  Award,
  ArrowRight,
  Calculator,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export interface SovereignBondItem {
  ticker: string;
  name: string;
  legislation: 'ARGENTINA' | 'NEW_YORK';
  maturityYear: number;
  maturityDate: string;
  lastPrice: number; // En USD
  tir: number; // TIR en USD (%)
  parity: number; // Paridad (%)
  coupon: number; // Cupón anual (%)
  currentYield: number; // Rendimiento corriente (%)
  modifiedDuration: number;
  spreadOverTreasury: number; // bps sobre US Treasury 10Y
}

export const SOVEREIGN_BONDS_DATA: SovereignBondItem[] = [
  // Bonares (Ley Argentina)
  {
    ticker: 'AL29D',
    name: 'Bono Rep. Argentina USD 2029 L.Arg',
    legislation: 'ARGENTINA',
    maturityYear: 2029,
    maturityDate: '09/07/2029',
    lastPrice: 72.4,
    tir: 15.8,
    parity: 72.4,
    coupon: 1.0,
    currentYield: 1.38,
    modifiedDuration: 2.8,
    spreadOverTreasury: 1140,
  },
  {
    ticker: 'AL30D',
    name: 'Bono Rep. Argentina USD 2030 L.Arg',
    legislation: 'ARGENTINA',
    maturityYear: 2030,
    maturityDate: '09/07/2030',
    lastPrice: 65.2,
    tir: 14.4,
    parity: 65.2,
    coupon: 0.75,
    currentYield: 1.15,
    modifiedDuration: 3.2,
    spreadOverTreasury: 1000,
  },
  {
    ticker: 'AL35D',
    name: 'Bono Rep. Argentina USD 2035 L.Arg',
    legislation: 'ARGENTINA',
    maturityYear: 2035,
    maturityDate: '09/07/2035',
    lastPrice: 54.8,
    tir: 14.9,
    parity: 54.8,
    coupon: 3.625,
    currentYield: 6.61,
    modifiedDuration: 6.1,
    spreadOverTreasury: 1050,
  },
  {
    ticker: 'AE38D',
    name: 'Bono Rep. Argentina USD 2038 L.Arg',
    legislation: 'ARGENTINA',
    maturityYear: 2038,
    maturityDate: '09/01/2038',
    lastPrice: 58.2,
    tir: 14.6,
    parity: 58.2,
    coupon: 4.25,
    currentYield: 7.30,
    modifiedDuration: 6.8,
    spreadOverTreasury: 1020,
  },
  {
    ticker: 'AL41D',
    name: 'Bono Rep. Argentina USD 2041 L.Arg',
    legislation: 'ARGENTINA',
    maturityYear: 2041,
    maturityDate: '09/07/2041',
    lastPrice: 51.5,
    tir: 14.2,
    parity: 51.5,
    coupon: 3.5,
    currentYield: 6.80,
    modifiedDuration: 7.6,
    spreadOverTreasury: 980,
  },

  // Globales (Ley Nueva York)
  {
    ticker: 'GD29D',
    name: 'Bono Global Rep. Arg. USD 2029 L.NY',
    legislation: 'NEW_YORK',
    maturityYear: 2029,
    maturityDate: '09/07/2029',
    lastPrice: 76.5,
    tir: 14.2,
    parity: 76.5,
    coupon: 1.0,
    currentYield: 1.31,
    modifiedDuration: 2.8,
    spreadOverTreasury: 980,
  },
  {
    ticker: 'GD30D',
    name: 'Bono Global Rep. Arg. USD 2030 L.NY',
    legislation: 'NEW_YORK',
    maturityYear: 2030,
    maturityDate: '09/07/2030',
    lastPrice: 68.8,
    tir: 13.2,
    parity: 68.8,
    coupon: 0.75,
    currentYield: 1.09,
    modifiedDuration: 3.2,
    spreadOverTreasury: 880,
  },
  {
    ticker: 'GD35D',
    name: 'Bono Global Rep. Arg. USD 2035 L.NY',
    legislation: 'NEW_YORK',
    maturityYear: 2035,
    maturityDate: '09/07/2035',
    lastPrice: 57.2,
    tir: 13.9,
    parity: 57.2,
    coupon: 3.625,
    currentYield: 6.34,
    modifiedDuration: 6.1,
    spreadOverTreasury: 950,
  },
  {
    ticker: 'GD38D',
    name: 'Bono Global Rep. Arg. USD 2038 L.NY',
    legislation: 'NEW_YORK',
    maturityYear: 2038,
    maturityDate: '09/01/2038',
    lastPrice: 61.5,
    tir: 13.6,
    parity: 61.5,
    coupon: 4.25,
    currentYield: 6.91,
    modifiedDuration: 6.8,
    spreadOverTreasury: 920,
  },
  {
    ticker: 'GD41D',
    name: 'Bono Global Rep. Arg. USD 2041 L.NY',
    legislation: 'NEW_YORK',
    maturityYear: 2041,
    maturityDate: '09/07/2041',
    lastPrice: 54.0,
    tir: 13.4,
    parity: 54.0,
    coupon: 3.5,
    currentYield: 6.48,
    modifiedDuration: 7.6,
    spreadOverTreasury: 900,
  },
  {
    ticker: 'GD46D',
    name: 'Bono Global Rep. Arg. USD 2046 L.NY',
    legislation: 'NEW_YORK',
    maturityYear: 2046,
    maturityDate: '09/07/2046',
    lastPrice: 56.4,
    tir: 13.8,
    parity: 56.4,
    coupon: 3.625,
    currentYield: 6.43,
    modifiedDuration: 8.4,
    spreadOverTreasury: 940,
  },
];

export const SovereignBondsCurveView: React.FC<{
  onSelectBondDetail?: (ticker: string) => void;
}> = ({ onSelectBondDetail }) => {
  const [metricMode, setMetricMode] = useState<'tir' | 'parity' | 'currentYield'>('tir');
  const [selectedTicker, setSelectedTicker] = useState<string>('AL30D');
  const [selectedLegislation, setSelectedLegislation] = useState<'ALL' | 'ARGENTINA' | 'NEW_YORK'>('ALL');

  const selectedBond = useMemo(() => {
    return SOVEREIGN_BONDS_DATA.find((b) => b.ticker === selectedTicker) || SOVEREIGN_BONDS_DATA[1];
  }, [selectedTicker]);

  // Bonares vs Globales
  const bonares = useMemo(() => SOVEREIGN_BONDS_DATA.filter((b) => b.legislation === 'ARGENTINA'), []);
  const globales = useMemo(() => SOVEREIGN_BONDS_DATA.filter((b) => b.legislation === 'NEW_YORK'), []);

  // Spread promedio Ley NY vs Ley Arg
  const spreadNYvsArg = useMemo(() => {
    const al30 = bonares.find((b) => b.ticker === 'AL30D')?.tir || 14.4;
    const gd30 = globales.find((b) => b.ticker === 'GD30D')?.tir || 13.2;
    return Number((al30 - gd30).toFixed(2));
  }, [bonares, globales]);

  // Configuración de escalas del SVG
  const svgWidth = 850;
  const svgHeight = 260;
  const padLeft = 60;
  const padRight = 50;
  const padTop = 30;
  const padBottom = 45;

  const chartInnerWidth = svgWidth - padLeft - padRight;
  const chartInnerHeight = svgHeight - padTop - padBottom;

  const minYear = 2028.5;
  const maxYear = 2046.5;
  const yearRange = maxYear - minYear;

  // Rango de la métrica activa
  const allMetricValues = SOVEREIGN_BONDS_DATA.map((b) => b[metricMode]);
  const minVal = Math.floor(Math.min(...allMetricValues) * 0.9);
  const maxVal = Math.ceil(Math.max(...allMetricValues) * 1.08);
  const valRange = maxVal - minVal || 1;

  // Coordenadas para Bonares
  const bonaresPoints = bonares.map((b) => {
    const x = padLeft + ((b.maturityYear - minYear) / yearRange) * chartInnerWidth;
    const y = padTop + chartInnerHeight - ((b[metricMode] - minVal) / valRange) * chartInnerHeight;
    return { ...b, x, y };
  });

  // Coordenadas para Globales
  const globalesPoints = globales.map((b) => {
    const x = padLeft + ((b.maturityYear - minYear) / yearRange) * chartInnerWidth;
    const y = padTop + chartInnerHeight - ((b[metricMode] - minVal) / valRange) * chartInnerHeight;
    return { ...b, x, y };
  });

  // Path generator
  const bonaresPath = bonaresPoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const globalesPath = globalesPoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const metricTitles = {
    tir: 'Tasa Interna de Retorno (TIR en USD %)',
    parity: 'Paridad de Mercado (% del Valor Nominal)',
    currentYield: 'Rendimiento Corriente Anual (%)',
  };

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-[#0c1833] to-primary-container text-white p-5 sm:p-6 rounded-2xl border border-primary/30 shadow-tactile flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-gold/20 text-gold rounded-xl">
              <TrendingUp size={22} />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-white">
              Curva Soberana de Bonos Hard Dollar (Bonares vs Globales)
            </h2>
            <Badge variant="gold" size="sm">
              DEUDA EN DÓLARES
            </Badge>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm max-w-4xl leading-relaxed">
            Estructura temporal de rendimientos (Yield Curve USD) de la deuda soberana argentina. Comparativa directa de curvas de rendimiento entre títulos Ley Local (AL) y Ley Nueva York (GD), paridades y riesgo país implícito.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-right">
            <div className="text-[10px] font-mono text-slate-300 uppercase">Spread Ley NY vs Arg (30s)</div>
            <div className="text-xl font-bold font-mono text-gold">+{spreadNYvsArg}% TIR</div>
            <div className="text-[10px] font-mono text-slate-300">~120 bps premio ley extranjera</div>
          </div>
        </div>
      </div>

      {/* Yield Curve SVG Chart */}
      <Card variant="default" accent="gold" className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-surface-container-highest pb-3">
          <div>
            <h3 className="font-h2 flex items-center gap-2">
              <TrendingUp size={18} className="text-gold" />
              Gráfico Dinámico: {metricTitles[metricMode]}
            </h3>
            <p className="font-subtitle text-xs">
              Haz clic en cualquier punto para ver el análisis del bono o abrir su calculadora de flujos
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-surface-container-high shrink-0 overflow-x-auto">
            {[
              { id: 'tir', label: 'TIR en USD (%)' },
              { id: 'parity', label: 'Paridad (%)' },
              { id: 'currentYield', label: 'Current Yield (%)' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMetricMode(m.id as any)}
                className={`px-3 py-1 text-xs font-sans font-bold rounded-lg transition-all ${
                  metricMode === m.id
                    ? 'bg-primary text-white shadow-sm scale-105'
                    : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Curve Canvas */}
        <div className="relative overflow-x-auto bg-surface-container-lowest p-3 rounded-2xl border border-surface-container-highest">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-64 sm:h-72 select-none overflow-visible"
          >
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const yVal = padTop + chartInnerHeight * (1 - pct);
              const labelVal = minVal + valRange * pct;
              return (
                <g key={i}>
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
                    className="text-[10px] font-mono fill-slate-400 font-semibold"
                  >
                    {labelVal.toFixed(1)}%
                  </text>
                </g>
              );
            })}

            {/* Vertical Year Grid Lines */}
            {[2029, 2030, 2035, 2038, 2041, 2046].map((yr) => {
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
                    className="text-[10px] font-mono fill-slate-400 font-bold"
                  >
                    {yr}
                  </text>
                </g>
              );
            })}

            {/* Bonares Curve (Gold / Amber) */}
            <path
              d={bonaresPath}
              fill="none"
              stroke="#F5BA42"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Globales Curve (Cyan / Blue) */}
            <path
              d={globalesPath}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5 3"
            />

            {/* Bonares Interactive Points */}
            {bonaresPoints.map((pt) => {
              const isSelected = pt.ticker === selectedTicker;
              const val = pt[metricMode];
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
                    fill={isSelected ? '#F5BA42' : '#D49B24'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-transform group-hover:scale-125"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    className={`text-[9px] font-mono font-bold ${
                      isSelected ? 'fill-gold text-xs' : 'fill-primary'
                    }`}
                  >
                    {pt.ticker}: {val.toFixed(1)}%
                  </text>
                </g>
              );
            })}

            {/* Globales Interactive Points */}
            {globalesPoints.map((pt) => {
              const isSelected = pt.ticker === selectedTicker;
              const val = pt[metricMode];
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
                    fill={isSelected ? '#38BDF8' : '#0284C7'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-transform group-hover:scale-125"
                  />
                  <text
                    x={pt.x}
                    y={pt.y + 16}
                    textAnchor="middle"
                    className={`text-[9px] font-mono font-bold ${
                      isSelected ? 'fill-blue-600 text-xs' : 'fill-slate-600'
                    }`}
                  >
                    {pt.ticker}: {val.toFixed(1)}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-sans pt-1 border-t border-surface-container-highest">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-on-surface">
              <span className="w-3 h-3 rounded-full bg-[#F5BA42] inline-block"></span>
              <strong>Curva Bonares (Ley Argentina AL)</strong>
            </span>
            <span className="flex items-center gap-1.5 text-on-surface">
              <span className="w-3 h-3 rounded-full bg-[#38BDF8] inline-block"></span>
              <strong>Curva Globales (Ley Nueva York GD)</strong>
            </span>
          </div>

          <div className="text-on-surface-variant text-xs">
            * Curva invertida en tramo corto reflejando compresión de riesgo y pago de cupones 2025.
          </div>
        </div>
      </Card>

      {/* Selected Bond Technical Sheet & Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-surface-container-highest shadow-tactile space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-sans font-bold text-base text-primary">
                  {selectedBond.ticker}
                </h4>
                <Badge variant={selectedBond.legislation === 'NEW_YORK' ? 'navy' : 'neutral'} size="sm">
                  {selectedBond.legislation === 'NEW_YORK' ? 'Ley NY' : 'Ley Arg'}
                </Badge>
              </div>
              <p className="text-xs font-sans text-on-surface-variant truncate">
                {selectedBond.name}
              </p>
            </div>

            <Badge variant="gold" size="sm">
              USD {selectedBond.lastPrice}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-[10px] font-mono text-outline block">TIR Anual USD</span>
                <span className="text-base font-bold font-mono text-gold">{selectedBond.tir}%</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-[10px] font-mono text-outline block">Paridad</span>
                <span className="text-base font-bold font-mono text-primary">{selectedBond.parity}%</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-[10px] font-mono text-outline block">Cupón Anual</span>
                <span className="text-base font-bold font-mono text-primary">{selectedBond.coupon}%</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-[10px] font-mono text-outline block">Duración Modificada</span>
                <span className="text-base font-bold font-mono text-primary">{selectedBond.modifiedDuration} años</span>
              </div>
            </div>

            {onSelectBondDetail && (
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center"
                onClick={() => onSelectBondDetail(selectedBond.ticker.replace('D', ''))}
                icon={<Calculator size={14} />}
              >
                Abrir Calculadora de Flujos ({selectedBond.ticker.replace('D', '')})
              </Button>
            )}
          </div>
        </div>

        {/* Full Table */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-surface-container-highest shadow-tactile space-y-3">
          <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
            <h4 className="font-sans font-bold text-sm text-primary">
              Comparativa Integral de Bonos Soberanos en Dólares
            </h4>
            <div className="flex items-center gap-1">
              {['ALL', 'ARGENTINA', 'NEW_YORK'].map((leg) => (
                <button
                  key={leg}
                  onClick={() => setSelectedLegislation(leg as any)}
                  className={`px-2.5 py-1 text-[10px] font-sans font-bold rounded-lg transition-all ${
                    selectedLegislation === leg
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {leg === 'ALL' ? 'Todos' : leg === 'ARGENTINA' ? 'Ley Arg' : 'Ley NY'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-surface-container-highest text-[10px] font-mono uppercase text-outline">
                  <th className="pb-2">Ticker</th>
                  <th className="pb-2">Ley</th>
                  <th className="pb-2">Vencimiento</th>
                  <th className="pb-2">Precio</th>
                  <th className="pb-2">TIR (%)</th>
                  <th className="pb-2">Paridad</th>
                  <th className="pb-2">Cupón</th>
                  <th className="pb-2">Current Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/60">
                {SOVEREIGN_BONDS_DATA.filter((b) => selectedLegislation === 'ALL' || b.legislation === selectedLegislation).map((b) => {
                  const isSel = selectedTicker === b.ticker;
                  return (
                    <tr
                      key={b.ticker}
                      onClick={() => setSelectedTicker(b.ticker)}
                      className={`cursor-pointer transition-colors ${
                        isSel ? 'bg-gold/15 font-bold shadow-inner' : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <td className="py-2.5 font-bold text-primary">{b.ticker}</td>
                      <td className="py-2.5">
                        <Badge variant={b.legislation === 'NEW_YORK' ? 'navy' : 'neutral'} size="sm">
                          {b.legislation === 'NEW_YORK' ? 'NY' : 'Arg'}
                        </Badge>
                      </td>
                      <td className="py-2.5 font-mono text-on-surface-variant">{b.maturityDate}</td>
                      <td className="py-2.5 font-mono text-primary">USD {b.lastPrice.toFixed(2)}</td>
                      <td className="py-2.5 font-mono text-gold font-bold">{b.tir.toFixed(1)}%</td>
                      <td className="py-2.5 font-mono text-primary">{b.parity.toFixed(1)}%</td>
                      <td className="py-2.5 font-mono text-on-surface-variant">{b.coupon.toFixed(2)}%</td>
                      <td className="py-2.5 font-mono text-bullish-green font-bold">{b.currentYield.toFixed(2)}%</td>
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
