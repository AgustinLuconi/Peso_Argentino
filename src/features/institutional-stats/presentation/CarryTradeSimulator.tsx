import React, { useState } from 'react';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import {
  Calculator,
  TrendingUp,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '@app/providers/AppContext';

export const CarryTradeSimulator: React.FC = () => {
  const { referenceUsdRate } = useApp();

  // Estados del simulador
  const [initialCapital, setInitialCapital] = useState<number>(5000000); // $5.000.000 por defecto
  const [daysTerm, setDaysTerm] = useState<number>(30); // 30 días
  const [lecapTna, setLecapTna] = useState<number>(43.5); // 43.5% TNA
  const [plazoFijoTna, setPlazoFijoTna] = useState<number>(34.0); // 34.0% TNA
  const monthlyInflation = 2.5; // 2.5% mensual estimada
  const monthlyDevaluation = 1.5; // 1.5% crawl mensual

  // Cálculos matemáticos
  const termMonths = daysTerm / 30;

  // 1. Lecap
  const lecapMonthlyRate = (lecapTna / 12) / 100;
  const lecapTotalRate = Math.pow(1 + lecapMonthlyRate, termMonths) - 1;
  const lecapFinalArs = initialCapital * (1 + lecapTotalRate);
  const lecapProfitArs = lecapFinalArs - initialCapital;

  // 2. Plazo Fijo Tradicional
  const pfMonthlyRate = (plazoFijoTna / 12) / 100;
  const pfTotalRate = Math.pow(1 + pfMonthlyRate, termMonths) - 1;
  const pfFinalArs = initialCapital * (1 + pfTotalRate);
  const pfProfitArs = pfFinalArs - initialCapital;

  // 3. Inflación Acumulada
  const inflationTotalRate = Math.pow(1 + monthlyInflation / 100, termMonths) - 1;
  const inflationArs = initialCapital * inflationTotalRate;

  // 4. Dólar MEP Proyectado & Ganancia en USD (Carry Trade Puro)
  const devalTotalRate = Math.pow(1 + monthlyDevaluation / 100, termMonths) - 1;
  const entryMep = referenceUsdRate > 0 ? referenceUsdRate : 1340;
  const exitMep = entryMep * (1 + devalTotalRate);

  const initialUsd = initialCapital / entryMep;
  const lecapFinalUsd = lecapFinalArs / exitMep;
  const lecapProfitUsd = lecapFinalUsd - initialUsd;
  const lecapYieldUsdPercent = ((lecapFinalUsd - initialUsd) / initialUsd) * 100;

  const presets = [1000000, 3000000, 5000000, 10000000, 25000000];

  return (
    <Card variant="default" accent="navy" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-highest dark:border-[#1E2638] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-2xl shrink-0 shadow-soft">
            <Calculator size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-h2 text-base sm:text-lg text-slate-900 dark:text-slate-100">
                Simulador de Rendimiento & Carry Trade
              </h2>
              <Badge variant="emerald" size="sm">
                TASA REAL EN PESOS
              </Badge>
            </div>
            <p className="font-subtitle text-xs text-on-surface-variant dark:text-slate-300 mt-0.5">
              Compara el rendimiento neto entre Letras del Tesoro (Lecaps), Plazo Fijo Tradicional y Dólar MEP
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setInitialCapital(5000000);
            setDaysTerm(30);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-bold text-slate-600 dark:text-slate-300 bg-surface-container-low dark:bg-[#131822] hover:bg-surface-container dark:hover:bg-[#161B26] border border-surface-container-highest dark:border-[#1E2638] rounded-xl transition-colors shrink-0"
        >
          <RotateCcw size={13} />
          Restablecer
        </button>
      </div>

      {/* Controles Interactivos de Entrada */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Columna Izquierda: Sliders & Parámetros */}
        <div className="lg:col-span-6 space-y-4 bg-surface-container-low dark:bg-[#131822] p-4 sm:p-5 rounded-2xl border border-surface-container-high dark:border-[#1E2638]">
          {/* Capital Inicial */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-sans font-bold text-xs text-slate-900 dark:text-slate-200">
                Capital a Invertir:
              </label>
              <span className="font-mono text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                ${initialCapital.toLocaleString('es-AR')} ARS
                <span className="text-[10px] text-slate-400 ml-1.5 font-normal">
                  (≈ US$ {initialUsd.toFixed(0)})
                </span>
              </span>
            </div>

            <input
              type="range"
              min={100000}
              max={30000000}
              step={100000}
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            {/* Presets de Capital */}
            <div className="flex gap-1.5 flex-wrap pt-1">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setInitialCapital(preset)}
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md transition-all ${
                    initialCapital === preset
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-[#0F141C] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1E2638] hover:border-emerald-500'
                  }`}
                >
                  ${(preset / 1000000).toFixed(0)}M
                </button>
              ))}
            </div>
          </div>

          {/* Plazo de Inversión */}
          <div className="space-y-2 pt-2 border-t border-surface-container-high dark:border-[#1E2638]">
            <div className="flex justify-between items-center">
              <label className="font-sans font-bold text-xs text-slate-900 dark:text-slate-200">
                Horizonte Temporal:
              </label>
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                {daysTerm} Días ({termMonths.toFixed(1)} meses)
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[30, 60, 90, 180].map((term) => (
                <button
                  key={term}
                  onClick={() => setDaysTerm(term)}
                  className={`py-1.5 text-xs font-mono font-bold rounded-xl transition-all ${
                    daysTerm === term
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-glow'
                      : 'bg-white dark:bg-[#0F141C] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1E2638] hover:border-emerald-500'
                  }`}
                >
                  {term} Días
                </button>
              ))}
            </div>
          </div>

          {/* Tasas Estimadas */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-container-high dark:border-[#1E2638] text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-sans text-slate-500 dark:text-slate-400 block font-bold uppercase">
                TNA Lecaps (Tesoro)
              </span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                <input
                  type="number"
                  step="0.5"
                  value={lecapTna}
                  onChange={(e) => setLecapTna(Number(e.target.value))}
                  className="w-16 p-1 bg-white dark:bg-[#0F141C] border border-slate-300 dark:border-[#1E2638] rounded-lg text-center font-mono font-bold text-xs"
                />
                <span>%</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-sans text-slate-500 dark:text-slate-400 block font-bold uppercase">
                TNA Plazo Fijo
              </span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                <input
                  type="number"
                  step="0.5"
                  value={plazoFijoTna}
                  onChange={(e) => setPlazoFijoTna(Number(e.target.value))}
                  className="w-16 p-1 bg-white dark:bg-[#0F141C] border border-slate-300 dark:border-[#1E2638] rounded-lg text-center font-mono font-bold text-xs"
                />
                <span>%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resultados y Ganador del Duelo */}
        <div className="lg:col-span-6 space-y-3.5 flex flex-col justify-between">
          {/* Card Ganadora: LECAPS */}
          <div className="p-4 sm:p-5 bg-emerald-500/10 dark:bg-emerald-950/30 rounded-2xl border-2 border-emerald-500/50 shadow-emerald-glow relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="font-eyebrow text-xs text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                <Zap size={14} className="animate-pulse text-emerald-500" /> Estrategia Óptima: Curva Lecaps
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-500 text-slate-950 rounded-full">
                +{(lecapTotalRate * 100).toFixed(2)}% TEM
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-2 flex-wrap sm:flex-nowrap min-w-0">
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-sans text-slate-600 dark:text-slate-300 block truncate">
                  Capital Final Obtenido:
                </span>
                <span className="text-lg sm:text-xl xl:text-2xl font-mono-tabular font-extrabold text-slate-900 dark:text-white block truncate tracking-tight">
                  ${lecapFinalArs.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="text-right min-w-0 flex-1">
                <span className="text-[11px] font-sans text-slate-600 dark:text-slate-300 block truncate">
                  Ganancia Neta en Pesos:
                </span>
                <span className="text-base sm:text-lg xl:text-xl font-mono-tabular font-extrabold text-emerald-600 dark:text-emerald-400 block truncate tracking-tight">
                  +${lecapProfitArs.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* Ganancia en Dólares (Carry Trade) */}
            <div className="mt-3 pt-3 border-t border-emerald-500/30 flex items-center justify-between gap-2 text-xs font-mono min-w-0 truncate">
              <span className="text-slate-600 dark:text-slate-300 truncate">
                Rendimiento en Dólares (USD):
              </span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                <TrendingUp size={13} /> +US$ {lecapProfitUsd.toFixed(1)} (+{lecapYieldUsdPercent.toFixed(2)}% en USD)
              </span>
            </div>
          </div>

          {/* Comparativa con Plazo Fijo & Inflación */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-surface-container-low dark:bg-[#0F141C] border border-surface-container-high dark:border-[#1E2638] rounded-xl space-y-1 min-w-0 overflow-hidden">
              <span className="text-[10px] font-sans font-bold uppercase text-slate-500 dark:text-slate-400 block truncate">
                Plazo Fijo Bancario
              </span>
              <span className="text-sm sm:text-base font-mono font-bold text-slate-900 dark:text-slate-100 block truncate tracking-tight">
                ${pfFinalArs.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block truncate">
                Ganancia: +${pfProfitArs.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
              </span>
            </div>

            <div className="p-3 bg-surface-container-low dark:bg-[#0F141C] border border-surface-container-high dark:border-[#1E2638] rounded-xl space-y-1 min-w-0 overflow-hidden">
              <span className="text-[10px] font-sans font-bold uppercase text-slate-500 dark:text-slate-400 block truncate">
                Inflación Proyectada ({monthlyInflation}%/m)
              </span>
              <span className="text-sm sm:text-base font-mono font-bold text-amber-500 block truncate tracking-tight">
                -${inflationArs.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[10px] font-mono text-emerald-500 block font-bold truncate">
                ✓ Tasa Real (+{(lecapTotalRate * 100 - inflationTotalRate * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
