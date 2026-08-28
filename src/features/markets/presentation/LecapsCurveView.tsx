import React, { useState, useMemo } from 'react';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { Button } from '@core/ui/components/Button';
import { Money } from '@core/domain/Money';
import {
  TrendingUp,
  Calculator,
  Calendar,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Info,
  Layers,
  Award,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export interface LecapItem {
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
  tramo: 'CORTO' | 'MEDIO' | 'LARGO';
  volume24h: number;
}

export const ALL_LECAPS_DATA: LecapItem[] = [
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
    tramo: 'CORTO',
    volume24h: 3850000000,
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
    tramo: 'CORTO',
    volume24h: 5200000000,
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
    tramo: 'CORTO',
    volume24h: 7400000000,
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
    tramo: 'MEDIO',
    volume24h: 4900000000,
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
    tramo: 'MEDIO',
    volume24h: 6100000000,
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
    tramo: 'MEDIO',
    volume24h: 8300000000,
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
    tramo: 'LARGO',
    volume24h: 3400000000,
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
    tramo: 'LARGO',
    volume24h: 4100000000,
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
    tramo: 'LARGO',
    volume24h: 5600000000,
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
    tramo: 'LARGO',
    volume24h: 4700000000,
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
    tramo: 'LARGO',
    volume24h: 3900000000,
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
    tramo: 'LARGO',
    volume24h: 6800000000,
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
    tramo: 'LARGO',
    volume24h: 7200000000,
  },
];

export const LecapsCurveView: React.FC = () => {
  const [metricType, setMetricType] = useState<'tem' | 'tna' | 'tea' | 'directYield'>('tem');
  const [selectedTicker, setSelectedTicker] = useState<string>('S31M5');
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000000); // 1 Millón ARS
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTramo, setFilterTramo] = useState<'ALL' | 'CORTO' | 'MEDIO' | 'LARGO'>('ALL');

  const selectedLecap = useMemo(() => {
    return ALL_LECAPS_DATA.find((l) => l.ticker === selectedTicker) || ALL_LECAPS_DATA[0];
  }, [selectedTicker]);

  // Cálculos de simulador
  const totalReturnDirect = (investmentAmount * selectedLecap.directYield) / 100;
  const finalCapital = investmentAmount + totalReturnDirect;
  const monthlyEstimatedReturn = (investmentAmount * selectedLecap.tem) / 100;

  // Filtrado de tabla
  const filteredList = useMemo(() => {
    return ALL_LECAPS_DATA.filter((l) => {
      const matchSearch =
        l.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTramo = filterTramo === 'ALL' || l.tramo === filterTramo;
      return matchSearch && matchTramo;
    });
  }, [searchQuery, filterTramo]);

  // Métricas extremas para el SVG Chart
  const metricValues = ALL_LECAPS_DATA.map((l) => l[metricType]);
  const minVal = Math.min(...metricValues);
  const maxVal = Math.max(...metricValues);
  const valRange = maxVal - minVal || 1;

  const minDays = Math.min(...ALL_LECAPS_DATA.map((l) => l.daysToMaturity));
  const maxDays = Math.max(...ALL_LECAPS_DATA.map((l) => l.daysToMaturity));
  const dayRange = maxDays - minDays || 1;

  // Generar puntos SVG normalizados para la curva
  // SVG Canvas dimensions: Width 900, Height 260. Margin X: 60, Margin Y: 40
  const svgWidth = 900;
  const svgHeight = 260;
  const padLeft = 60;
  const padRight = 50;
  const padTop = 30;
  const padBottom = 45;

  const chartInnerWidth = svgWidth - padLeft - padRight;
  const chartInnerHeight = svgHeight - padTop - padBottom;

  const points = ALL_LECAPS_DATA.map((item) => {
    const x = padLeft + ((item.daysToMaturity - minDays) / dayRange) * chartInnerWidth;
    const y = padTop + chartInnerHeight - ((item[metricType] - minVal) / valRange) * chartInnerHeight;
    return { ...item, x, y };
  });

  // Generar SVG Path para la línea de la curva
  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  // Generar SVG Path para el área con gradiente debajo de la curva
  const areaD = `${pathD} L ${points[points.length - 1].x},${padTop + chartInnerHeight} L ${points[0].x},${padTop + chartInnerHeight} Z`;

  // Título de la métrica activa
  const metricLabels = {
    tem: 'Tasa Efectiva Mensual (TEM % m/m)',
    tna: 'Tasa Nominal Anual (TNA %)',
    tea: 'Tasa Efectiva Anual Compuesta (TEA %)',
    directYield: 'Rendimiento Directo al Vencimiento (%)',
  };

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Top Banner Institucional */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-[#0b1736] text-white p-5 sm:p-6 rounded-2xl border border-primary/30 shadow-tactile flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-gold/20 text-gold rounded-xl">
              <TrendingUp size={22} />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-white">
              Curva de Rendimientos de Lecaps & Boncaps (Tesoro Nacional)
            </h1>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm max-w-4xl leading-relaxed">
            Estructura Temporal de Tasas de Interés (ETTI) de Letras y Bonos Capitalizables en pesos. Análisis de pendiente de la curva, Tasa Efectiva Mensual (TEM), TNA, TEA y spreads de tasa real positiva contra el Relevamiento de Expectativas de Mercado (REM).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-right">
            <div className="text-[10px] font-sans text-slate-300 uppercase">TEM Promedio Curva</div>
            <div className="text-xl font-bold font-sans text-gold">3.88% m/m</div>
            <div className="text-[10px] font-sans text-bullish-green font-semibold">Tasa Real: +5.4 p.p.</div>
          </div>
        </div>
      </div>

      {/* Podio / Top Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#071228] p-4 rounded-2xl border border-surface-container-highest dark:border-[#1a2744] shadow-soft flex items-center gap-3.5">
          <div className="p-2.5 bg-gold/15 text-gold rounded-xl shrink-0">
            <Award size={22} />
          </div>
          <div>
            <span className="text-[10px] font-sans text-outline dark:text-slate-400 uppercase block">Mayor Tasa Mensual (TEM)</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold font-sans text-primary dark:text-slate-100">T15D5</span>
              <span className="text-sm font-bold font-sans text-gold">4.12% m/m</span>
            </div>
            <span className="text-[11px] font-sans text-on-surface-variant dark:text-slate-300">Boncap Dic 25 · TEA 65.2%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#071228] p-4 rounded-2xl border border-surface-container-highest dark:border-[#1a2744] shadow-soft flex items-center gap-3.5">
          <div className="p-2.5 bg-blue-500/15 text-blue-600 rounded-xl shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-[10px] font-sans text-outline dark:text-slate-400 uppercase block">Liquidez Inmediata (Corto)</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold font-sans text-primary dark:text-slate-100">S31E5</span>
              <span className="text-sm font-bold font-sans text-primary dark:text-slate-100">15 días</span>
            </div>
            <span className="text-[11px] font-sans text-on-surface-variant dark:text-slate-300">TEM 3.55% · Vto 31/01/2025</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#071228] p-4 rounded-2xl border border-surface-container-highest dark:border-[#1a2744] shadow-soft flex items-center gap-3.5">
          <div className="p-2.5 bg-bullish-green/15 text-bullish-green rounded-xl shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="text-[10px] font-sans text-outline uppercase block">Mayor Spread Real vs REM</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold font-sans text-primary">S15D5</span>
              <span className="text-sm font-bold font-sans text-bullish-green">+10.1 p.p.</span>
            </div>
            <span className="text-[11px] font-sans text-on-surface-variant">Rend. Directo +48.2%</span>
          </div>
        </div>
      </div>

      {/* Main Yield Curve SVG Chart */}
      <Card variant="default" accent="gold" className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-surface-container-highest pb-3">
          <div>
            <h2 className="font-h2 flex items-center gap-2">
              <TrendingUp size={18} className="text-gold" />
              Gráfico Dinámico de la Curva de Rendimientos
            </h2>
            <p className="font-subtitle text-xs">
              Estructura temporal: {metricLabels[metricType]}. Haz clic en cualquier punto para seleccionarla y simular.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-surface-container-high shrink-0 overflow-x-auto">
            {[
              { id: 'tem', label: 'TEM (Mensual %)' },
              { id: 'tna', label: 'TNA (%)' },
              { id: 'tea', label: 'TEA (%)' },
              { id: 'directYield', label: 'Rend. Directo (%)' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMetricType(m.id as any)}
                className={`px-3 py-1 text-xs font-sans font-bold rounded-lg transition-all ${
                  metricType === m.id
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
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5BA42" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#F5BA42" stopOpacity="0.0" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Background Grid Horizontal Lines */}
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
                    className="text-[10px] font-sans fill-slate-400 font-semibold"
                  >
                    {labelVal.toFixed(1)}%
                  </text>
                </g>
              );
            })}

            {/* Vertical Tramo Separators */}
            {/* Tramo Corto (<90d), Tramo Medio (90-180d), Tramo Largo (>180d) */}
            <rect
              x={padLeft}
              y={padTop}
              width={((90 - minDays) / dayRange) * chartInnerWidth}
              height={chartInnerHeight}
              fill="#3B82F6"
              fillOpacity="0.03"
            />
            <rect
              x={padLeft + ((90 - minDays) / dayRange) * chartInnerWidth}
              y={padTop}
              width={((180 - 90) / dayRange) * chartInnerWidth}
              height={chartInnerHeight}
              fill="#10B981"
              fillOpacity="0.03"
            />
            <rect
              x={padLeft + ((180 - minDays) / dayRange) * chartInnerWidth}
              y={padTop}
              width={((maxDays - 180) / dayRange) * chartInnerWidth}
              height={chartInnerHeight}
              fill="#F59E0B"
              fillOpacity="0.03"
            />

            {/* Gradient Area below curve */}
            <path d={areaD} fill="url(#curveGradient)" />

            {/* Curve Stroke Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#D49B24"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points on the Curve */}
            {points.map((pt) => {
              const isSelected = pt.ticker === selectedTicker;
              const pointVal = pt[metricType];

              return (
                <g
                  key={pt.ticker}
                  onClick={() => setSelectedTicker(pt.ticker)}
                  className="cursor-pointer group"
                >
                  {/* Outer ring on selection */}
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="10"
                      fill="none"
                      stroke="#F5BA42"
                      strokeWidth="2.5"
                      className="animate-ping opacity-75"
                    />
                  )}

                  {/* Main Point Circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? '6.5' : '4.5'}
                    fill={isSelected ? '#F5BA42' : '#0B192C'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-200 group-hover:scale-125"
                  />

                  {/* Top Value Tag */}
                  <g
                    transform={`translate(${pt.x}, ${pt.y - 12})`}
                    className={`transition-opacity duration-200 ${
                      isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    <rect
                      x="-20"
                      y="-14"
                      width="40"
                      height="15"
                      rx="4"
                      fill={isSelected ? '#0B192C' : '#FFFFFF'}
                      stroke={isSelected ? '#F5BA42' : '#CBD5E1'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="-3"
                      textAnchor="middle"
                      className={`text-[9px] font-sans font-bold ${
                        isSelected ? 'fill-gold' : 'fill-primary'
                      }`}
                    >
                      {pointVal.toFixed(2)}%
                    </text>
                  </g>

                  {/* Bottom Ticker & Days Label */}
                  <text
                    x={pt.x}
                    y={padTop + chartInnerHeight + 16}
                    textAnchor="middle"
                    className={`text-[10px] font-sans font-bold ${
                      isSelected ? 'fill-gold text-xs' : 'fill-primary group-hover:fill-gold'
                    }`}
                  >
                    {pt.ticker}
                  </text>
                  <text
                    x={pt.x}
                    y={padTop + chartInnerHeight + 28}
                    textAnchor="middle"
                    className="text-[9px] font-sans fill-slate-400"
                  >
                    {pt.daysToMaturity}d
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Curve Legend & Duration Tramo Guide */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-sans pt-1 border-t border-surface-container-highest">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="w-3 h-3 rounded bg-blue-500/20 border border-blue-400 inline-block"></span>
              <strong>Tramo Corto</strong> (&lt; 90 días)
            </span>
            <span className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-400 inline-block"></span>
              <strong>Tramo Medio</strong> (90 - 180 días)
            </span>
            <span className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-400 inline-block"></span>
              <strong>Tramo Largo</strong> (&gt; 180 días)
            </span>
          </div>

          <div className="flex items-center gap-2 text-primary font-semibold">
            <CheckCircle2 size={14} className="text-bullish-green" />
            <span>Pendiente Positiva: Mayor tasa por mayor plazo de permanencia</span>
          </div>
        </div>
      </Card>

      {/* Simulator & Detailed Technical Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Investment Simulator */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-surface-container-highest shadow-tactile space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container-highest pb-3">
            <span className="p-1.5 bg-gold/15 text-gold rounded-lg">
              <Calculator size={18} />
            </span>
            <div>
              <h3 className="font-sans font-bold text-sm text-primary">
                Simulador de Inversión en Lecap
              </h3>
              <p className="text-[11px] font-sans text-on-surface-variant">
                Rendimiento exacto en pesos al vencimiento
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-sans font-semibold text-on-surface mb-1">
                Letra / Ticker a Simular
              </label>
              <select
                value={selectedTicker}
                onChange={(e) => setSelectedTicker(e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-surface-container-high rounded-xl text-xs font-sans font-bold text-primary focus:outline-none focus:border-gold"
              >
                {ALL_LECAPS_DATA.map((l) => (
                  <option key={l.ticker} value={l.ticker}>
                    {l.ticker} — {l.maturityDate} ({l.daysToMaturity}d) · TEM {l.tem}% · Rend. {l.directYield}%
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold text-on-surface mb-1">
                Capital a Invertir en Pesos ($ ARS)
              </label>
              <input
                type="number"
                step="50000"
                min="1000"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value) || 0)}
                className="w-full p-2.5 bg-surface-container-low border border-surface-container-high rounded-xl text-sm font-sans font-bold text-primary focus:outline-none focus:border-gold"
              />
            </div>

            {/* Result Box */}
            <div className="p-4 bg-surface-container-lowest border border-surface-container-highest rounded-xl space-y-2.5">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-on-surface-variant">Capital Inicial:</span>
                <span className="font-sans font-bold text-primary">
                  {Money.formatArs(investmentAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-on-surface-variant">Rendimiento Directo ({selectedLecap.directYield}%):</span>
                <span className="font-sans font-bold text-bullish-green">
                  +{Money.formatArs(totalReturnDirect)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-on-surface-variant">Ganancia Mensual Est. (TEM {selectedLecap.tem}%):</span>
                <span className="font-sans font-semibold text-primary">
                  ~{Money.formatArs(monthlyEstimatedReturn)} /mes
                </span>
              </div>

              <div className="pt-2 border-t border-surface-container flex justify-between items-center text-sm font-sans">
                <span className="font-bold text-primary">Cobro Final al Vencimiento:</span>
                <span className="font-sans font-black text-gold text-base">
                  {Money.formatArs(finalCapital)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] font-sans text-amber-900 flex items-start gap-2">
              <ShieldCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <span>
                Las Lecaps devengan intereses diariamente con capitalización mensual. A diferencia de un Plazo Fijo, tienen <strong>liquidez inmediata en BYMA en T+1 o T+0</strong>.
              </span>
            </div>
          </div>
        </div>

        {/* Selected Lecap Full Details & Comprehensive Table */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-surface-container-highest shadow-tactile space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-highest pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans font-bold text-base text-primary">
                  Ficha Técnica de la Letra: {selectedLecap.ticker}
                </h3>
                <Badge variant="navy" size="sm">
                  {selectedLecap.type}
                </Badge>
                <Badge
                  variant={
                    selectedLecap.tramo === 'CORTO'
                      ? 'outline'
                      : selectedLecap.tramo === 'MEDIO'
                      ? 'bullish'
                      : 'gold'
                  }
                  size="sm"
                >
                  Tramo {selectedLecap.tramo}
                </Badge>
              </div>
              <p className="text-xs font-sans text-on-surface-variant mt-0.5">
                {selectedLecap.name} · Vencimiento oficial: <strong>{selectedLecap.maturityDate}</strong> ({selectedLecap.daysToMaturity} días restantes)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="bullish" size="sm">
                Spread Real vs REM: +{selectedLecap.spreadInflation} p.p.
              </Badge>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className="text-[10px] font-sans text-outline uppercase block">TEM Mensual</span>
              <span className="text-xl font-bold font-sans text-gold">{selectedLecap.tem}%</span>
              <span className="text-[10px] font-sans text-slate-400 block">Tasa efectiva/mes</span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className="text-[10px] font-sans text-outline uppercase block">TNA Efectiva</span>
              <span className="text-xl font-bold font-sans text-primary">{selectedLecap.tna}%</span>
              <span className="text-[10px] font-sans text-slate-400 block">Base 365 días</span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className="text-[10px] font-sans text-outline uppercase block">TEA Compuesta</span>
              <span className="text-xl font-bold font-sans text-primary">{selectedLecap.tea}%</span>
              <span className="text-[10px] font-sans text-slate-400 block">Con reinversión</span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className="text-[10px] font-sans text-outline uppercase block">Rend. Directo</span>
              <span className="text-xl font-bold font-sans text-bullish-green">+{selectedLecap.directYield}%</span>
              <span className="text-[10px] font-sans text-slate-400 block">Total al vencimiento</span>
            </div>
          </div>

          {/* Filter & Search Bar for Full Table */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar Lecap o Boncap (ej: S31M5, Mayo, Boncap)..."
                className="px-3 py-1.5 bg-surface-container-low border border-surface-container-high rounded-xl text-xs font-sans focus:outline-none focus:border-gold w-64"
              />
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] font-sans text-outline mr-1">Tramo:</span>
              {[
                { id: 'ALL', label: 'Todos' },
                { id: 'CORTO', label: 'Corto (<90d)' },
                { id: 'MEDIO', label: 'Medio (90-180d)' },
                { id: 'LARGO', label: 'Largo (>180d)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterTramo(f.id as any)}
                  className={`px-2.5 py-1 text-[11px] font-sans font-semibold rounded-lg transition-all ${
                    filterTramo === f.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-surface-container-highest text-[10px] font-sans uppercase text-outline">
                  <th className="pb-2 font-semibold">Ticker</th>
                  <th className="pb-2 font-semibold">Tipo</th>
                  <th className="pb-2 font-semibold">Vencimiento</th>
                  <th className="pb-2 font-semibold">Días</th>
                  <th className="pb-2 font-semibold">Precio Spot</th>
                  <th className="pb-2 font-semibold">TEM (%)</th>
                  <th className="pb-2 font-semibold">TNA (%)</th>
                  <th className="pb-2 font-semibold">TEA (%)</th>
                  <th className="pb-2 font-semibold">Rend. Total</th>
                  <th className="pb-2 font-semibold">Spread REM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/60">
                {filteredList.map((l) => {
                  const isSel = selectedTicker === l.ticker;
                  return (
                    <tr
                      key={l.ticker}
                      onClick={() => setSelectedTicker(l.ticker)}
                      className={`cursor-pointer transition-colors ${
                        isSel
                          ? 'bg-gold/15 font-bold shadow-inner'
                          : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <td className="py-2.5 font-bold text-primary flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSel ? 'bg-gold' : 'bg-transparent'}`}></span>
                        {l.ticker}
                      </td>
                      <td className="py-2.5">
                        <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
                          {l.type}
                        </span>
                      </td>
                      <td className="py-2.5 font-sans text-on-surface-variant">{l.maturityDate}</td>
                      <td className="py-2.5 font-sans text-outline">{l.daysToMaturity}d</td>
                      <td className="py-2.5 font-sans text-primary">${l.lastPrice.toFixed(2)}</td>
                      <td className="py-2.5 font-sans text-gold font-bold">{l.tem.toFixed(2)}%</td>
                      <td className="py-2.5 font-sans text-primary">{l.tna.toFixed(1)}%</td>
                      <td className="py-2.5 font-sans text-primary font-semibold">{l.tea.toFixed(1)}%</td>
                      <td className="py-2.5 font-sans text-bullish-green font-bold">+{l.directYield.toFixed(2)}%</td>
                      <td className="py-2.5 font-sans text-primary">+{l.spreadInflation.toFixed(1)} p.p.</td>
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
