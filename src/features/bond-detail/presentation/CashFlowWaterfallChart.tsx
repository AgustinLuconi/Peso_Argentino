import React, { useState } from 'react';
import { CashFlowItem } from '../domain/BondDetail';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';

export interface CashFlowWaterfallChartProps {
  cashFlows: CashFlowItem[];
  nominalBonds: number;
}

export const CashFlowWaterfallChart: React.FC<CashFlowWaterfallChartProps> = ({
  cashFlows,
  nominalBonds,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartHeight = 180;
  const chartWidth = 600;
  const paddingX = 35;
  const paddingY = 25;

  const displayFlows = cashFlows.filter((cf) => cf.status !== 'paid');

  const maxPayout = Math.max(
    ...displayFlows.map((cf) => (nominalBonds / 100) * cf.totalCashFlowUsd),
    10
  );

  const barSlotWidth = (chartWidth - paddingX * 2) / displayFlows.length;
  const barWidth = Math.min(32, Math.max(16, barSlotWidth - 12));

  const activeFlow = hoveredIndex !== null ? displayFlows[hoveredIndex] : null;

  return (
    <div className="space-y-4 bg-surface-container-low p-4 sm:p-6 rounded-3xl border border-surface-container-high shadow-soft">
      {/* Header with Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-highest pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gold/20 text-gold rounded-xl shrink-0">
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 className="font-h3 text-base text-primary">
              Evolución Gráfica del Flujo de Fondos Proyectado (USD)
            </h3>
            <p className="font-subtitle text-xs">
              Cobro de amortización de capital y cupones de interés por período
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-sans">
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#0c1730] px-2.5 py-1 rounded-xl border border-surface-container-high shadow-soft">
            <span className="h-2.5 w-2.5 rounded-full bg-gold inline-block"></span>
            <span className="font-eyebrow text-on-surface">Amortización Capital</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#0c1730] px-2.5 py-1 rounded-xl border border-surface-container-high shadow-soft">
            <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block"></span>
            <span className="font-eyebrow text-on-surface">Cupón Interés</span>
          </div>
        </div>
      </div>

      {/* Interactive Floating Hover Metric Strip */}
      <div className="h-14 flex items-center justify-between px-4 py-2 bg-white dark:bg-[#081124] rounded-2xl border border-surface-container-highest shadow-soft transition-all duration-200">
        {activeFlow ? (
          <div className="w-full flex items-center justify-between text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gold" />
              <span className="font-sans font-bold text-primary">
                Pago {activeFlow.paymentDate}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                Residual: {activeFlow.remainingCapitalPercent.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center gap-4 font-mono-tabular">
              <div>
                <span className="font-eyebrow text-outline mr-1.5">Amort:</span>
                <span className="font-bold text-gold">
                  US$ {((nominalBonds / 100) * activeFlow.amortizationAmountUsd).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="font-eyebrow text-outline mr-1.5">Renta:</span>
                <span className="font-bold text-primary">
                  US$ {((nominalBonds / 100) * activeFlow.interestAmountUsd).toFixed(2)}
                </span>
              </div>
              <div className="pl-3 border-l border-surface-container-highest">
                <span className="font-eyebrow text-primary mr-1.5">Total:</span>
                <span className="font-extrabold text-bullish-green text-sm">
                  US$ {((nominalBonds / 100) * activeFlow.totalCashFlowUsd).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs font-sans text-on-surface-variant flex items-center gap-2">
            <TrendingUp size={14} className="text-gold" />
            <span>Pasa el cursor por las barras para ver el detalle de amortización y renta de cada vencimiento.</span>
          </div>
        )}
      </div>

      {/* SVG Bar Chart */}
      <div className="relative w-full h-[200px] pt-2 select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="goldBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2BE78" />
              <stop offset="100%" stopColor="#C5A059" />
            </linearGradient>
            <linearGradient id="navyBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00356B" />
              <stop offset="100%" stopColor="#001833" />
            </linearGradient>
          </defs>

          {/* Horizontal Reference Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac, idx) => {
            const y = chartHeight - frac * (chartHeight - paddingY * 2) - paddingY;
            const value = frac * maxPayout;
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
                  className="dark:stroke-[#1a2744]"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-mono-tabular fill-outline"
                >
                  ${value.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Render Bars */}
          {displayFlows.map((cf, idx) => {
            const isHovered = hoveredIndex === idx;
            const x =
              paddingX +
              idx * barSlotWidth +
              (barSlotWidth - barWidth) / 2;

            const totalPayout = (nominalBonds / 100) * cf.totalCashFlowUsd;
            const amortPayout = (nominalBonds / 100) * cf.amortizationAmountUsd;
            const interestPayout = (nominalBonds / 100) * cf.interestAmountUsd;

            const totalHeight =
              (totalPayout / maxPayout) * (chartHeight - paddingY * 2);
            const amortHeight =
              (amortPayout / maxPayout) * (chartHeight - paddingY * 2);
            const interestHeight =
              (interestPayout / maxPayout) * (chartHeight - paddingY * 2);

            const yTotal = chartHeight - totalHeight - paddingY;
            const yAmort = chartHeight - amortHeight - paddingY;
            const yInterest = yTotal;

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setHoveredIndex(idx)}
              >
                {/* Hit target area */}
                <rect
                  x={x - 4}
                  y={paddingY}
                  width={barWidth + 8}
                  height={chartHeight - paddingY * 2}
                  fill="transparent"
                />

                {/* Interest Bar */}
                <rect
                  x={x}
                  y={yInterest}
                  width={barWidth}
                  height={Math.max(2, interestHeight)}
                  fill="url(#navyBarGradient)"
                  rx="5"
                  className={`transition-all duration-200 ${
                    isHovered ? 'filter drop-shadow-md brightness-125' : 'opacity-95'
                  }`}
                />

                {/* Amortization Bar */}
                {amortHeight > 0 && (
                  <rect
                    x={x}
                    y={yAmort}
                    width={barWidth}
                    height={Math.max(2, amortHeight)}
                    fill="url(#goldBarGradient)"
                    rx="5"
                    className={`transition-all duration-200 ${
                      isHovered ? 'filter drop-shadow-md brightness-125' : 'opacity-95'
                    }`}
                  />
                )}

                {/* Amount text on top */}
                <text
                  x={x + barWidth / 2}
                  y={yTotal - 5}
                  textAnchor="middle"
                  className={`text-[9px] font-mono-tabular font-bold transition-colors ${
                    isHovered ? 'fill-gold text-xs' : 'fill-primary'
                  }`}
                >
                  ${totalPayout.toFixed(0)}
                </text>

                {/* Date Label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  className={`text-[9px] font-mono-tabular uppercase font-semibold transition-colors ${
                    isHovered ? 'fill-gold font-bold' : 'fill-outline'
                  }`}
                >
                  {cf.paymentDate.slice(3)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
