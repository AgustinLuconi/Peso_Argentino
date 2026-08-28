import React from 'react';
import { MarketIndexData } from '../application/MarketRepositoryPort';
import { TrendIndicator } from '@core/ui/components/TrendIndicator';
import { TrendingUp, Activity } from 'lucide-react';

export const MervalIndicesHeader: React.FC<{ indices: MarketIndexData[] }> = ({
  indices,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {indices.map((idx, index) => (
        <div
          key={idx.name}
          className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
            index === 0
              ? 'bg-slate-900 dark:bg-[#131822] text-white border-slate-800 dark:border-emerald-500/40 shadow-tactile'
              : 'bg-white dark:bg-[#0F141C] text-on-surface border-surface-container-highest dark:border-[#1E2638] shadow-tactile'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <span
                className={`p-2 rounded-xl ${
                  index === 0
                    ? 'bg-primary-container text-gold'
                    : 'bg-surface-container text-primary'
                }`}
              >
                {index === 0 ? <TrendingUp size={18} /> : <Activity size={18} />}
              </span>
              <div>
                <span
                  className={`font-sans font-bold text-xs sm:text-sm uppercase tracking-wider block ${
                    index === 0 ? 'text-white' : 'text-primary'
                  }`}
                >
                  {idx.name}
                </span>
                <span
                  className={`text-[11px] font-sans ${
                    index === 0 ? 'text-slate-300' : 'text-outline'
                  }`}
                >
                  {idx.currency} · Índice Oficial
                </span>
              </div>
            </div>

            <TrendIndicator value={idx.variation24h} size="md" />
          </div>

          {/* Big Index Value */}
          <div className="my-3 flex items-baseline justify-between">
            <span
              className={`text-2xl sm:text-3xl font-mono-tabular font-extrabold tracking-tight ${
                index === 0 ? 'text-white' : 'text-primary'
              }`}
            >
              {idx.value.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              <span className="text-xs font-normal opacity-70">pts</span>
            </span>
          </div>

          {/* Volume & Status */}
          <div
            className={`pt-2.5 border-t flex items-center justify-between text-xs font-sans ${
              index === 0
                ? 'border-white/10 text-slate-300'
                : 'border-surface-container-highest dark:border-[#1a2744] text-on-surface-variant'
            }`}
          >
            <span className="font-eyebrow">Volumen 24h</span>
            <span className="font-mono-tabular font-bold">
              ${(idx.volumeTotal / 1000000).toFixed(0)}M {idx.currency}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
