import React from 'react';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { Ship, ArrowUpRight, ArrowDownLeft, Scale } from 'lucide-react';

export const TradeBalanceCard: React.FC<{
  tradeSummary: {
    exportsUsd: number;
    importsUsd: number;
    surplusUsd: number;
    period: string;
  };
}> = ({ tradeSummary }) => {
  return (
    <Card variant="default" accent="none" className="space-y-4">
      <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary text-gold rounded-xl shrink-0 shadow-sm">
            <Ship size={18} />
          </div>
          <div>
            <h2 className="font-h2 text-sm sm:text-base">
              Balanza Comercial (INDEC)
            </h2>
            <span className="font-subtitle text-xs block">
              {tradeSummary.period}
            </span>
          </div>
        </div>
        <Badge variant="bullish" size="sm">
          SUPERÁVIT
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Exports */}
        <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container-high space-y-1 hover:-translate-y-0.5 transition-all shadow-soft min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-outline text-[10px] uppercase font-bold">
            <span className="font-eyebrow">Exportaciones</span>
            <ArrowUpRight size={13} className="text-bullish-green shrink-0" />
          </div>
          <span className="text-base sm:text-lg font-mono-tabular font-extrabold text-primary block truncate tracking-tight">
            US$ {(tradeSummary.exportsUsd / 1_000_000_000).toFixed(1)} B
          </span>
          <span className="text-[10px] text-outline block truncate">Agro, Energía & Minería</span>
        </div>

        {/* Imports */}
        <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container-high space-y-1 hover:-translate-y-0.5 transition-all shadow-soft min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-outline text-[10px] uppercase font-bold">
            <span className="font-eyebrow">Importaciones</span>
            <ArrowDownLeft size={13} className="text-on-surface-variant shrink-0" />
          </div>
          <span className="text-base sm:text-lg font-mono-tabular font-extrabold text-primary block truncate tracking-tight">
            US$ {(tradeSummary.importsUsd / 1_000_000_000).toFixed(1)} B
          </span>
          <span className="text-[10px] text-outline block truncate">Bienes de Capital</span>
        </div>

        {/* Surplus */}
        <div className="p-3.5 bg-teal-50 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-800/40 space-y-1 hover:-translate-y-0.5 transition-all shadow-soft min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-teal-800 dark:text-teal-400 text-[10px] uppercase font-bold">
            <span className="font-eyebrow text-teal-800 dark:text-teal-400">Superávit Neto</span>
            <Scale size={13} className="text-bullish-green shrink-0" />
          </div>
          <span className="text-base sm:text-lg font-mono-tabular font-extrabold text-bullish-green block truncate tracking-tight">
            +US$ {(tradeSummary.surplusUsd / 1_000_000_000).toFixed(1)} B
          </span>
          <span className="text-[10px] text-teal-700 dark:text-teal-400 block truncate">Saldo a favor</span>
        </div>
      </div>
    </Card>
  );
};
