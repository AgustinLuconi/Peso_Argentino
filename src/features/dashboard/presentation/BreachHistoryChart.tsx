import React, { useState } from 'react';
import { TimeSeries } from '@core/domain/TimeSeries';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { TrendingDown } from 'lucide-react';

export interface BreachHistoryChartProps {
  timeSeries?: TimeSeries;
}

export type BreachTimeframe = '1M' | '3M' | '6M' | '1Y' | '3Y' | 'ALL';

interface HistoricalBreachPoint {
  label: string;
  timestamp: string;
  value: number; // Porcentaje de brecha CCL vs Oficial
  oficial: number;
  ccl: number;
}

const MULTI_YEAR_BREACH_DATA: Record<BreachTimeframe, HistoricalBreachPoint[]> = {
  '1M': [
    { label: '27 Jul', timestamp: '27 Jul', value: 14.8, oficial: 1195, ccl: 1372 },
    { label: '03 Ago', timestamp: '03 Ago', value: 14.2, oficial: 1200, ccl: 1370 },
    { label: '10 Ago', timestamp: '10 Ago', value: 13.9, oficial: 1202, ccl: 1369 },
    { label: '17 Ago', timestamp: '17 Ago', value: 14.5, oficial: 1205, ccl: 1380 },
    { label: '24 Ago', timestamp: '24 Ago', value: 14.1, oficial: 1208, ccl: 1378 },
    { label: '27 Ago', timestamp: 'Hoy', value: 14.08, oficial: 1210, ccl: 1380 },
  ],
  '3M': [
    { label: 'Jun 2026', timestamp: 'Jun 26', value: 16.5, oficial: 1180, ccl: 1375 },
    { label: 'Jun 15', timestamp: '15 Jun', value: 15.8, oficial: 1188, ccl: 1376 },
    { label: 'Jul 2026', timestamp: 'Jul 26', value: 15.2, oficial: 1195, ccl: 1376 },
    { label: 'Jul 15', timestamp: '15 Jul', value: 14.6, oficial: 1200, ccl: 1375 },
    { label: 'Ago 2026', timestamp: 'Ago 26', value: 14.1, oficial: 1208, ccl: 1378 },
    { label: '27 Ago', timestamp: 'Hoy', value: 14.08, oficial: 1210, ccl: 1380 },
  ],
  '6M': [
    { label: 'Mar 2026', timestamp: 'Mar 26', value: 19.4, oficial: 1150, ccl: 1373 },
    { label: 'Abr 2026', timestamp: 'Abr 26', value: 18.2, oficial: 1162, ccl: 1374 },
    { label: 'May 2026', timestamp: 'May 26', value: 17.1, oficial: 1175, ccl: 1376 },
    { label: 'Jun 2026', timestamp: 'Jun 26', value: 16.5, oficial: 1180, ccl: 1375 },
    { label: 'Jul 2026', timestamp: 'Jul 26', value: 14.8, oficial: 1195, ccl: 1372 },
    { label: 'Ago 2026', timestamp: 'Hoy', value: 14.08, oficial: 1210, ccl: 1380 },
  ],
  '1Y': [
    { label: 'Sep 2025', timestamp: 'Sep 25', value: 24.8, oficial: 1040, ccl: 1298 },
    { label: 'Nov 2025', timestamp: 'Nov 25', value: 22.5, oficial: 1070, ccl: 1311 },
    { label: 'Ene 2026', timestamp: 'Ene 26', value: 21.0, oficial: 1110, ccl: 1343 },
    { label: 'Mar 2026', timestamp: 'Mar 26', value: 19.4, oficial: 1150, ccl: 1373 },
    { label: 'May 2026', timestamp: 'May 26', value: 17.1, oficial: 1175, ccl: 1376 },
    { label: 'Jul 2026', timestamp: 'Jul 26', value: 14.8, oficial: 1195, ccl: 1372 },
    { label: 'Ago 2026', timestamp: 'Hoy', value: 14.08, oficial: 1210, ccl: 1380 },
  ],
  '3Y': [
    { label: 'Ago 2023', timestamp: 'Ago 23 (PASO)', value: 102.8, oficial: 350, ccl: 710 },
    { label: 'Oct 2023', timestamp: 'Oct 23 (Elec)', value: 191.4, oficial: 350, ccl: 1020 },
    { label: 'Dic 2023', timestamp: 'Dic 23 (Deval)', value: 26.2, oficial: 800, ccl: 1010 },
    { label: 'Jun 2024', timestamp: 'Jun 24', value: 41.4, oficial: 905, ccl: 1280 },
    { label: 'Dic 2024', timestamp: 'Dic 24', value: 16.3, oficial: 1015, ccl: 1180 },
    { label: 'Jun 2025', timestamp: 'Jun 25', value: 12.0, oficial: 1080, ccl: 1210 },
    { label: 'Dic 2025', timestamp: 'Dic 25', value: 6.5, oficial: 1150, ccl: 1225 },
    { label: 'Ago 2026', timestamp: 'Hoy', value: 14.08, oficial: 1210, ccl: 1380 },
  ],
  'ALL': [
    { label: 'Ene 2022', timestamp: '2022', value: 99.0, oficial: 103, ccl: 205 },
    { label: 'Jul 2022', timestamp: 'Jul 22 (Crisis)', value: 150.7, oficial: 130, ccl: 326 },
    { label: 'Ene 2023', timestamp: '2023', value: 95.0, oficial: 177, ccl: 344 },
    { label: 'Oct 2023', timestamp: 'Oct 23 (Pico)', value: 191.4, oficial: 350, ccl: 1020 },
    { label: 'Dic 2023', timestamp: 'Dic 23 (Deval)', value: 26.2, oficial: 800, ccl: 1010 },
    { label: 'Jun 2024', timestamp: '2024', value: 41.4, oficial: 905, ccl: 1280 },
    { label: 'Dic 2024', timestamp: 'Dic 24', value: 16.3, oficial: 1015, ccl: 1180 },
    { label: 'Jun 2025', timestamp: '2025', value: 12.0, oficial: 1080, ccl: 1210 },
    { label: 'Dic 2025', timestamp: 'Dic 25', value: 6.5, oficial: 1150, ccl: 1225 },
    { label: 'Ago 2026', timestamp: 'Hoy', value: 14.08, oficial: 1210, ccl: 1380 },
  ],
};

export const BreachHistoryChart: React.FC<BreachHistoryChartProps> = () => {
  const [timeframe, setTimeframe] = useState<BreachTimeframe>('3Y');
  const points = MULTI_YEAR_BREACH_DATA[timeframe];
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(points.length - 1);

  const activePoint =
    selectedPointIndex !== null && points[selectedPointIndex]
      ? points[selectedPointIndex]
      : points[points.length - 1];

  const maxVal = Math.ceil(Math.max(...points.map((p) => p.value)) * 1.15);
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const chartHeight = 160;
  const chartWidth = 540;
  const paddingX = 30;
  const paddingY = 20;

  // SVG Points
  const svgCoords = points.map((p, idx) => {
    const x = (idx / (points.length - 1)) * (chartWidth - paddingX * 2) + paddingX;
    const y = chartHeight - ((p.value - minVal) / range) * (chartHeight - paddingY * 2) - paddingY;
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

  const areaD = `${pathD} L ${svgCoords[svgCoords.length - 1].x} ${chartHeight} L ${svgCoords[0].x} ${chartHeight} Z`;

  return (
    <Card variant="default" accent="none" className="flex flex-col justify-between space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-highest pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-h3 text-base text-primary">
              Evolución Histórica de la Brecha Cambiaria (CCL vs Oficial)
            </h3>
            <Badge variant="bullish" size="sm">
              COMPRESIÓN HISTÓRICA
            </Badge>
          </div>
          <p className="font-subtitle text-xs mt-0.5">
            Diferencial porcentual entre tipo de cambio financiero y mayorista desde 2022
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container-high shrink-0 overflow-x-auto">
          {(['1M', '3M', '6M', '1Y', '3Y', 'ALL'] as BreachTimeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                setTimeframe(tf);
                setSelectedPointIndex(MULTI_YEAR_BREACH_DATA[tf].length - 1);
              }}
              className={`px-2.5 py-1 text-xs font-sans font-bold rounded-lg transition-all ${
                timeframe === tf
                  ? 'bg-primary text-white shadow-sm scale-105'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Point Highlight Badge */}
      {activePoint && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-surface-container-low rounded-xl border border-surface-container-high text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="font-eyebrow text-outline">Período:</span>
            <span className="font-bold text-primary">{activePoint.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-on-surface-variant">
              Oficial: <strong>${activePoint.oficial}</strong>
            </span>
            <span className="text-on-surface-variant">
              CCL: <strong>${activePoint.ccl}</strong>
            </span>
            <div className="flex items-center gap-1 font-bold text-gold bg-white px-2 py-0.5 rounded-lg border border-gold/30">
              <span>Brecha:</span>
              <span className="text-sm font-black">{activePoint.value.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive SVG Chart */}
      <div className="py-2">
        <div className="relative w-full h-[180px]">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="breachGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C5A059" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#C5A059" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const level = Math.round(minVal + range * pct);
              const y = chartHeight - pct * (chartHeight - paddingY * 2) - paddingY;
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#e1e3e4"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={chartWidth - paddingX + 5}
                    y={y + 3}
                    className="text-[9px] fill-outline font-sans font-semibold"
                  >
                    {level}%
                  </text>
                </g>
              );
            })}

            {/* Area and line */}
            <path d={areaD} fill="url(#breachGradient)" />
            <path
              d={pathD}
              fill="none"
              stroke="#775a19"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Points */}
            {svgCoords.map((pt) => {
              const isSelected = selectedPointIndex === pt.index;
              return (
                <g
                  key={pt.index}
                  className="cursor-pointer"
                  onClick={() => setSelectedPointIndex(pt.index)}
                  onMouseEnter={() => setSelectedPointIndex(pt.index)}
                >
                  <circle cx={pt.x} cy={pt.y} r={16} fill="transparent" />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 5.5 : 3.5}
                    fill={isSelected ? '#002347' : '#C5A059'}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2 : 1.5}
                    className="transition-all duration-150"
                  />
                  {isSelected && (
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      className="text-[10px] font-sans font-bold fill-primary"
                    >
                      {pt.point.value.toFixed(1)}%
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between px-3 text-[11px] font-sans text-on-surface-variant border-t border-surface-container-highest pt-2">
          {points.map((p, i) => (
            <span
              key={i}
              onClick={() => setSelectedPointIndex(i)}
              className={`cursor-pointer transition-colors ${
                selectedPointIndex === i ? 'text-primary font-bold scale-105' : 'hover:text-primary'
              }`}
            >
              {p.timestamp}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Insight */}
      <div className="pt-3 border-t border-surface-container-highest flex items-center justify-between text-xs font-sans text-on-surface-variant">
        <div className="flex items-center gap-1.5 text-bullish-green">
          <TrendingDown size={14} />
          <span className="font-semibold">
            Compresión histórica desde picos de 190% (Oct 2023) hacia niveles sostenibles
          </span>
        </div>
        <span className="text-[11px] font-sans text-outline font-semibold">
          Convergencia Cambiaria
        </span>
      </div>
    </Card>
  );
};
