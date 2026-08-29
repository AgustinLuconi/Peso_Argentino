import React, { useState } from 'react';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { Calculator } from 'lucide-react';

export const RealRateCalculatorCard: React.FC = () => {
  const [tna, setTna] = useState<number>(32.0);
  const [inflationMonthly, setInflationMonthly] = useState<number>(2.2);

  const temMonthly = (tna * 30) / 365;
  const realRateMonthly = ((1 + temMonthly / 100) / (1 + inflationMonthly / 100) - 1) * 100;
  const realRateAnnualized = (Math.pow(1 + realRateMonthly / 100, 12) - 1) * 100;

  return (
    <Card variant="default" accent="gold" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container-highest pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary text-gold rounded-xl shrink-0 shadow-sm">
            <Calculator size={18} />
          </div>
          <div>
            <h2 className="font-h2 text-base sm:text-lg">
              Simulador de Tasa Real en Pesos (Carry Trade vs Inflación)
            </h2>
            <p className="font-subtitle text-xs">
              Calcula el rendimiento real positivo en moneda local ajustado por el IPC del INDEC
            </p>
          </div>
        </div>

        <Badge variant={realRateMonthly >= 0 ? 'bullish' : 'bearish'} size="sm">
          {realRateMonthly >= 0 ? 'TASA REAL POSITIVA' : 'TASA REAL NEGATIVA'}
        </Badge>
      </div>

      {/* Input sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-surface-container-high">
        {/* TNA slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-eyebrow">
              Tasa Nominal Anual (TNA)
            </span>
            <span className="font-mono-tabular font-bold text-primary">{tna.toFixed(1)}% TNA</span>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            step="0.5"
            value={tna}
            onChange={(e) => setTna(parseFloat(e.target.value))}
            className="w-full h-2 bg-surface-container-high rounded-full cursor-pointer transition-all"
          />
          <span className="text-[10px] font-mono text-outline block">
            Rendimiento mensual bruto (TEM): {temMonthly.toFixed(2)}%
          </span>
        </div>

        {/* Inflation IPC slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-eyebrow">
              Inflación Mensual Proyectada (IPC)
            </span>
            <span className="font-mono-tabular font-bold text-secondary">
              {inflationMonthly.toFixed(1)}% mensual
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="15"
            step="0.1"
            value={inflationMonthly}
            onChange={(e) => setInflationMonthly(parseFloat(e.target.value))}
            className="w-full h-2 bg-surface-container-high rounded-full cursor-pointer transition-all"
          />
          <span className="text-[10px] font-mono text-outline block">
            Inflación anualizada equivalente: {(Math.pow(1 + inflationMonthly / 100, 12) * 100 - 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container-high hover:-translate-y-1 transition-all duration-200 shadow-soft min-w-0 overflow-hidden">
          <span className="font-eyebrow block mb-1 truncate">
            Tasa Efectiva Mensual (TEM)
          </span>
          <span className="text-base sm:text-lg lg:text-xl font-mono-tabular font-bold text-primary block truncate tracking-tight">
            +{temMonthly.toFixed(2)}%
          </span>
          <span className="text-[10px] text-outline block mt-0.5 truncate">Rendimiento nominal</span>
        </div>

        <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-800/40 hover:-translate-y-1 transition-all duration-200 shadow-soft min-w-0 overflow-hidden">
          <span className="font-eyebrow text-bullish-green font-bold block mb-1 truncate">
            Tasa Real Mensual (ex-post)
          </span>
          <span className="text-base sm:text-lg lg:text-xl font-mono-tabular font-bold text-bullish-green block truncate tracking-tight">
            {realRateMonthly >= 0 ? `+${realRateMonthly.toFixed(2)}%` : `${realRateMonthly.toFixed(2)}%`}
          </span>
          <span className="text-[10px] text-teal-700 dark:text-teal-400 block mt-0.5 truncate">Ganancia sobre IPC</span>
        </div>

        <div className="p-4 bg-champagne-light/60 dark:bg-[#131822] rounded-2xl border border-gold/40 hover:-translate-y-1 transition-all duration-200 shadow-soft min-w-0 overflow-hidden">
          <span className="font-eyebrow text-secondary font-bold block mb-1 truncate">
            Tasa Real Anualizada
          </span>
          <span className="text-base sm:text-lg lg:text-xl font-mono-tabular font-bold text-primary block truncate tracking-tight">
            {realRateAnnualized >= 0 ? `+${realRateAnnualized.toFixed(1)}%` : `${realRateAnnualized.toFixed(1)}%`}
          </span>
          <span className="text-[10px] text-secondary block mt-0.5 truncate">Retorno real proyectado</span>
        </div>
      </div>
    </Card>
  );
};
