import React, { useState } from 'react';
import { MacroComparativeData } from '../domain/MacroComparativeSeries';
import { Card } from '@core/ui/components/Card';
import { Tabs } from '@core/ui/components/Tabs';
import { Badge } from '@core/ui/components/Badge';
import { LineChart, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

export const MacroSeriesComparator: React.FC<{ series: MacroComparativeData }> = ({
  series,
}) => {
  const [activeSeriesKey, setActiveSeriesKey] = useState<
    'inflation' | 'reserves' | 'monetaryBase' | 'tradeBalance'
  >('inflation');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tabs = [
    { id: 'inflation', label: 'Inflación Mensual IPC (%)' },
    { id: 'reserves', label: 'Reservas BCRA (USD M)' },
    { id: 'monetaryBase', label: 'Base Monetaria ($ B)' },
    { id: 'tradeBalance', label: 'Superávit Comercial (USD M)' },
  ];

  const currentSeries =
    activeSeriesKey === 'inflation'
      ? series.inflationIndec
      : activeSeriesKey === 'reserves'
      ? series.grossReservesSeries
      : activeSeriesKey === 'monetaryBase'
      ? series.monetaryBaseSeries
      : series.tradeBalanceSeries;

  const points = currentSeries.points;
  const rawMin = currentSeries.minValue;
  const rawMax = currentSeries.maxValue;
  const buffer = (rawMax - rawMin) * 0.18 || 1;
  const minVal = Math.max(0, rawMin - buffer);
  const maxVal = rawMax + buffer;
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  // Generous dimensions to guarantee no squashing and no overlap on any screen
  const chartHeight = 320;
  const chartWidth = 920;
  const paddingLeft = 90; // Ample left margin for complete separation between Y-axis labels and points
  const paddingRight = 45;
  const paddingY = 40;

  const svgCoords = points.map((p, idx) => {
    const x =
      points.length > 1
        ? (idx / (points.length - 1)) * (chartWidth - paddingLeft - paddingRight) + paddingLeft
        : chartWidth / 2;
    const y =
      chartHeight -
      ((p.value - minVal) / range) * (chartHeight - paddingY * 2) -
      paddingY;
    return { x, y, point: p, index: idx };
  });

  const pathD = svgCoords.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = svgCoords[idx - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD =
    svgCoords.length > 0
      ? `${pathD} L ${svgCoords[svgCoords.length - 1].x} ${chartHeight - paddingY / 2} L ${svgCoords[0].x} ${chartHeight - paddingY / 2} Z`
      : '';

  const activePoint = hoveredIndex !== null ? svgCoords[hoveredIndex] : svgCoords[svgCoords.length - 1];
  const prevPoint = hoveredIndex !== null && hoveredIndex > 0 ? svgCoords[hoveredIndex - 1] : svgCoords[svgCoords.length - 2];
  const diffVal = activePoint && prevPoint ? activePoint.point.value - prevPoint.point.value : 0;
  const diffPercent = prevPoint && prevPoint.point.value !== 0 ? (diffVal / prevPoint.point.value) * 100 : 0;

  // Format axis tick numbers cleanly based on series
  const formatAxisTick = (val: number) => {
    if (activeSeriesKey === 'inflation') {
      return `${val.toFixed(1)}%`;
    }
    if (activeSeriesKey === 'monetaryBase') {
      return `$ ${val.toFixed(0)} B`;
    }
    if (activeSeriesKey === 'reserves' || activeSeriesKey === 'tradeBalance') {
      return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val.toFixed(0)}`;
    }
    return val.toFixed(0);
  };

  const getFullValueFormatted = (val: number) => {
    if (activeSeriesKey === 'inflation') {
      return `${val.toFixed(1)}%`;
    }
    if (activeSeriesKey === 'monetaryBase') {
      return `$ ${val.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} Billones`;
    }
    if (activeSeriesKey === 'reserves') {
      return `US$ ${val.toLocaleString('es-AR')} M`;
    }
    return `US$ +${val.toLocaleString('es-AR')} M`;
  };

  return (
    <Card variant="default" accent="gold" className="space-y-5">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-surface-container-highest pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary text-gold rounded-2xl shrink-0 shadow-soft">
            <LineChart size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-h2 text-base sm:text-lg">
                Comparador de Series Macroeconómicas
              </h2>
              <Badge variant="gold" size="sm">
                INDEC / BCRA
              </Badge>
            </div>
            <p className="font-subtitle text-xs">
              Evolución cronológica de precios, reservas, pasivos del Banco Central y balanza comercial
            </p>
          </div>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeSeriesKey}
          onChange={(id) => {
            setActiveSeriesKey(id as any);
            setHoveredIndex(null);
          }}
          variant="institutional"
        />
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 bg-surface-container-low dark:bg-[#0c1730] p-4 rounded-2xl border border-surface-container-high dark:border-[#1a2744] shadow-soft">
        <div>
          <span className="font-eyebrow block mb-1">Último Valor Registrado</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-mono-tabular font-extrabold text-primary">
              {activePoint ? getFullValueFormatted(activePoint.point.value) : '--'}
            </span>
          </div>
        </div>

        <div>
          <span className="font-eyebrow block mb-1">Período Seleccionado</span>
          <span className="text-sm font-sans font-bold text-on-surface flex items-center gap-1.5">
            <Calendar size={14} className="text-gold" />
            {activePoint?.point.label || activePoint?.point.timestamp || '--'}
          </span>
        </div>

        <div>
          <span className="font-eyebrow block mb-1">Variación vs Mes Previo</span>
          <div className="flex items-center gap-1.5 font-mono-tabular text-sm font-bold">
            {diffVal >= 0 ? (
              <TrendingUp size={15} className="text-bullish-green" />
            ) : (
              <TrendingDown size={15} className="text-bearish-red" />
            )}
            <span className={diffVal >= 0 ? 'text-bullish-green' : 'text-bearish-red'}>
              {diffVal >= 0 ? '+' : ''}{diffVal.toFixed(2)} ({diffPercent.toFixed(1)}%)
            </span>
          </div>
        </div>

        <div>
          <span className="font-eyebrow block mb-1">Rango de la Serie</span>
          <span className="text-xs font-mono-tabular text-on-surface-variant font-semibold">
            Mín {rawMin.toFixed(1)} · Máx {rawMax.toFixed(1)} {currentSeries.unit}
          </span>
        </div>
      </div>

      {/* Interactive SVG Chart Container with High Resolution Height */}
      <div className="relative bg-surface-container-lowest dark:bg-[#040914] p-4 sm:p-6 rounded-3xl border border-surface-container-high dark:border-[#1a2744] shadow-inner-tactile">
        {/* Floating Tooltip Indicator */}
        {activePoint && (
          <div
            className="absolute z-10 pointer-events-none hidden sm:flex flex-col bg-primary text-white p-3 rounded-2xl shadow-xl border border-gold/50 text-xs transition-all duration-150 -translate-x-1/2 -translate-y-full mb-4 animate-in fade-in zoom-in-95"
            style={{
              left: `${(activePoint.x / chartWidth) * 100}%`,
              top: `${(activePoint.y / chartHeight) * 100}%`,
            }}
          >
            <span className="font-eyebrow text-gold text-[10px] uppercase tracking-wider mb-0.5">
              {activePoint.point.label || activePoint.point.timestamp}
            </span>
            <div className="flex items-baseline gap-1 font-mono-tabular font-extrabold text-base">
              <span>{activePoint.point.value.toLocaleString('es-AR')}</span>
              <span className="text-gold text-xs">{currentSeries.unit}</span>
            </div>
          </div>
        )}

        {/* Generous Height Container to Avoid Flattening */}
        <div className="w-full h-[320px] sm:h-[360px]">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="macroGradientV4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#002347" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#C5A059" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#002347" stopOpacity="0.0" />
              </linearGradient>
              <filter id="glowEffectV4" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#002347" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Horizontal Grid Ticks & Clean Y-Axis Numbers (Properly Offset) */}
            {[0.0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
              const y = chartHeight - frac * (chartHeight - paddingY * 2) - paddingY;
              const val = minVal + frac * range;
              return (
                <g key={idx}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={chartWidth - paddingRight}
                    y2={y}
                    stroke="#e1e3e4"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                    className="dark:stroke-[#1a2744]"
                  />
                  {/* Y Axis Value positioned cleanly on the left with textAnchor='end' */}
                  <text
                    x={paddingLeft - 14}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[11px] font-mono-tabular fill-outline font-semibold"
                  >
                    {formatAxisTick(val)}
                  </text>
                </g>
              );
            })}

            {/* Gradient Area */}
            {areaD && <path d={areaD} fill="url(#macroGradientV4)" />}

            {/* Main Smooth Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#002347"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glowEffectV4)"
              />
            )}

            {/* Interactive Points */}
            {svgCoords.map((pt, i) => {
              const isHovered = hoveredIndex === i || (hoveredIndex === null && i === svgCoords.length - 1);
              return (
                <g
                  key={i}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Invisible hit target for smooth hover */}
                  <circle cx={pt.x} cy={pt.y} r={22} fill="transparent" />

                  {/* Outer aura on active */}
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={12}
                      fill="#C5A059"
                      opacity={0.35}
                      className="animate-pulse"
                    />
                  )}

                  {/* Visual Node */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 7 : 4.5}
                    fill={isHovered ? '#C5A059' : '#002347'}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 3 : 2}
                    className="transition-all duration-200"
                  />

                  {/* Value Label above dot (Only highlighted when hovered or active to prevent clutter) */}
                  {isHovered && (
                    <text
                      x={pt.x}
                      y={pt.y - 12}
                      textAnchor="middle"
                      className="text-[12px] font-mono-tabular font-extrabold fill-primary"
                    >
                      {pt.point.value.toLocaleString('es-AR')}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* X Axis Timestamps with Alignment Matching Padding */}
        <div
          className="flex justify-between border-t border-surface-container-high dark:border-[#1a2744] pt-3 mt-1"
          style={{ paddingLeft: `${paddingLeft}px`, paddingRight: `${paddingRight}px` }}
        >
          {points.map((p, i) => {
            const isHovered = hoveredIndex === i || (hoveredIndex === null && i === points.length - 1);
            return (
              <span
                key={i}
                onClick={() => setHoveredIndex(i)}
                className={`text-xs font-mono transition-all duration-150 cursor-pointer select-none ${
                  isHovered
                    ? 'text-gold font-bold scale-110'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {p.timestamp}
              </span>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
