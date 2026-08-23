import React, { useState } from 'react';
import { TimeSeries } from '@core/domain/TimeSeries';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { TrendingDown, Info, Calendar } from 'lucide-react';

export interface BreachHistoryChartProps {
  timeSeries: TimeSeries;
}

export const BreachHistoryChart: React.FC<BreachHistoryChartProps> = ({
  timeSeries,
}) => {
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(
    timeSeries.points.length - 1
  );

  const points = timeSeries.points;
  const activePoint =
    selectedPointIndex !== null ? points[selectedPointIndex] : points[points.length - 1];

  const minVal = 0;
  const maxVal = 30;
  const range = maxVal - minVal;
  const chartHeight = 160;
  const chartWidth = 500;
  const paddingX = 20;
  const paddingY = 20;

  // Calculate SVG points
  const svgCoords = points.map((p, idx) => {
    const x =
      (idx / (points.length - 1)) * (chartWidth - paddingX * 2) + paddingX;
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

  const areaD = `${pathD} L ${svgCoords[svgCoords.length - 1].x} ${chartHeight} L ${svgCoords[0].x} ${chartHeight} Z`;

  return (
    <Card variant="default" accent="none" className="flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-highest pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-h3 text-base text-primary">
              Evolución de la Brecha Cambiaria (CCL vs Oficial)
            </h3>
            <Badge variant="bullish" size="sm">
              COMPRESIÓN HISTÓRICA
            </Badge>
          </div>
          <p className="font-subtitle text-xs mt-0.5">
            Diferencial porcentual entre el tipo de cambio financiero y el tipo de cambio mayorista
          </p>
        </div>

        {activePoint && (
          <div className="flex items-baseline gap-2 bg-surface-container-low px-3 py-1.5 rounded-xl border border-surface-container-high">
            <span className="font-eyebrow text-outline">
              {activePoint.label || activePoint.timestamp}:
            </span>
            <span className="text-base font-mono-tabular font-bold text-primary">
              {activePoint.value.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* Interactive SVG Chart */}
      <div className="py-4">
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
            {[5, 10, 15, 20, 25].map((level) => {
              const y =
                chartHeight -
                ((level - minVal) / range) * (chartHeight - paddingY * 2) -
                paddingY;
              return (
                <g key={level}>
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
                    className="text-[9px] fill-outline font-mono-tabular"
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
                  {/* Invisible hit target for smooth hover */}
                  <circle cx={pt.x} cy={pt.y} r={16} fill="transparent" />

                  {/* Visual Node */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 5 : 3.5}
                    fill={isSelected ? '#002347' : '#C5A059'}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2 : 1.5}
                    className="transition-all duration-150"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between px-3 text-xs font-mono text-on-surface-variant border-t border-surface-container-highest pt-2">
          {points.map((p, i) => (
            <span
              key={i}
              onClick={() => setSelectedPointIndex(i)}
              className={`cursor-pointer transition-colors ${
                selectedPointIndex === i ? 'text-primary font-bold' : 'hover:text-primary'
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
            Reducción sostenida hacia la unificación del mercado cambiario
          </span>
        </div>
        <span className="text-[11px] font-mono text-outline">
          Objetivo: Convergencia Unificada
        </span>
      </div>
    </Card>
  );
};
