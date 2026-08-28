import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { ArrowRightLeft, DollarSign, TrendingUp, Sparkles } from 'lucide-react';

export interface QuickCurrencyConverterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DollarOption {
  type: string;
  name: string;
  shortName: string;
  rate: number;
  spread: number;
}

const DOLLAR_RATES: DollarOption[] = [
  { type: 'mep', name: 'Dólar MEP Bolsa (AL30)', shortName: 'Dólar MEP', rate: 1192.4, spread: 4.2 },
  { type: 'ccl', name: 'Contado con Liquidación (CCL)', shortName: 'Dólar CCL', rate: 1218.9, spread: 6.9 },
  { type: 'blue', name: 'Dólar Blue Informal', shortName: 'Dólar Blue', rate: 1220.0, spread: 20.0 },
  { type: 'cripto', name: 'Dólar Cripto (USDT)', shortName: 'Cripto USDT', rate: 1215.0, spread: 4.5 },
  { type: 'oficial', name: 'Dólar Oficial (BNA)', shortName: 'Oficial BNA', rate: 1068.5, spread: 40.0 },
  { type: 'tarjeta', name: 'Dólar Tarjeta / Turista (+60%)', shortName: 'Dólar Tarjeta', rate: 1709.6, spread: 59.6 },
];

export const QuickCurrencyConverter: React.FC<QuickCurrencyConverterProps> = ({
  isOpen,
  onClose,
}) => {
  const [direction, setDirection] = useState<'ARS_TO_USD' | 'USD_TO_ARS'>('ARS_TO_USD');
  const [selectedType, setSelectedType] = useState<string>('mep');
  const [amount, setAmount] = useState<number>(100000);

  const currentRateObj = DOLLAR_RATES.find((r) => r.type === selectedType) || DOLLAR_RATES[0];
  const rate = currentRateObj.rate;

  const convertedResult =
    direction === 'ARS_TO_USD'
      ? amount / rate
      : amount * rate;

  const quickPresets =
    direction === 'ARS_TO_USD'
      ? [
          { label: '$ 50.000', val: 50000 },
          { label: '$ 100.000', val: 100000 },
          { label: '$ 500.000', val: 500000 },
          { label: '$ 1.000.000', val: 1000000 },
        ]
      : [
          { label: 'US$ 50', val: 50 },
          { label: 'US$ 100', val: 100 },
          { label: 'US$ 500', val: 500 },
          { label: 'US$ 1.000', val: 1000 },
        ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Conversor Instantáneo de Divisas & Brecha"
      subtitle="Calcula conversiones exactas entre pesos argentinos y todos los tipos de cambio en tiempo real"
      maxWidth="2xl"
    >
      <div className="space-y-6 font-sans">
        {/* Direction Switcher Banner */}
        <div className="flex items-center justify-between gap-4 bg-slate-100 dark:bg-[#131822] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#1E2638]">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              {direction === 'ARS_TO_USD' ? 'Pesos a Dólares (ARS ➔ USD)' : 'Dólares a Pesos (USD ➔ ARS)'}
            </span>
            <span className="px-2.5 py-1 text-xs font-bold font-mono rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              SPOT EN VIVO
            </span>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              setDirection((prev) => (prev === 'ARS_TO_USD' ? 'USD_TO_ARS' : 'ARS_TO_USD'));
              setAmount(direction === 'ARS_TO_USD' ? 100 : 100000);
            }}
            icon={<ArrowRightLeft size={16} />}
          >
            Invertir Dirección
          </Button>
        </div>

        {/* Input & Dollar Type Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Amount input */}
          <div className="space-y-2">
            <label className="font-eyebrow text-slate-700 dark:text-slate-300 block text-xs font-bold">
              Monto a Convertir ({direction === 'ARS_TO_USD' ? '$ Pesos ARS' : 'US$ Dólares USD'})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 font-mono text-base font-bold text-slate-400 dark:text-slate-500">
                {direction === 'ARS_TO_USD' ? '$' : 'US$'}
              </span>
              <input
                type="number"
                min="1"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="Ingresar importe..."
                className="w-full pl-12 pr-4 py-3 text-lg font-mono-tabular font-bold bg-white dark:bg-[#0F141C] text-slate-900 dark:text-white border border-slate-300 dark:border-[#1E2638] rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
              />
            </div>

            {/* Quick Presets with clear readable buttons */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Atajos:
              </span>
              {quickPresets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setAmount(p.val)}
                  className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border transition-all ${
                    amount === p.val
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-[#131822] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#1E2638] hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-[#161B26]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dollar Type Selector */}
          <div className="space-y-2">
            <label className="font-eyebrow text-slate-700 dark:text-slate-300 block text-xs font-bold">
              Tipo de Cambio Seleccionado
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 text-sm font-semibold bg-white dark:bg-[#0F141C] text-slate-900 dark:text-white border border-slate-300 dark:border-[#1E2638] rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
            >
              {DOLLAR_RATES.map((d) => (
                <option key={d.type} value={d.type}>
                  {d.name} — ${d.rate.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono pt-1">
              <span>Referencia spot:</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">
                $ {currentRateObj.rate.toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS
              </span>
            </div>
          </div>
        </div>

        {/* Big Converted Result Display Card */}
        <div className="p-6 bg-slate-950 dark:bg-[#111622] text-white rounded-2xl border border-emerald-500/40 shadow-tactile flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden">
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 block">
              Resultado Estimado al tipo de cambio {currentRateObj.shortName}:
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-mono-tabular font-black text-white tracking-tight">
              {direction === 'ARS_TO_USD'
                ? `US$ ${convertedResult.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : `$ ${convertedResult.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-sm font-bold shrink-0">
            {direction === 'ARS_TO_USD'
              ? `1 USD = $${rate.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
              : `$1 ARS = US$ ${(1 / rate).toFixed(4)}`}
          </div>
        </div>

        {/* Comparison across all dollar quotes */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="font-eyebrow text-slate-700 dark:text-slate-300 block text-xs font-bold">
              Comparativa simultánea con todas las cotizaciones:
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Haz clic para seleccionar
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DOLLAR_RATES.map((d) => {
              const res =
                direction === 'ARS_TO_USD'
                  ? amount / d.rate
                  : amount * d.rate;
              const isCurrent = d.type === selectedType;

              return (
                <div
                  key={d.type}
                  onClick={() => setSelectedType(d.type)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500 shadow-md scale-[1.02]'
                      : 'bg-white dark:bg-[#0F141C] hover:bg-slate-50 dark:hover:bg-[#161B26] border-slate-200 dark:border-[#1E2638] hover:border-emerald-500/40 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex justify-between items-center gap-1 mb-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {d.shortName}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
                      ${d.rate.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="font-mono-tabular font-extrabold text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
                    {direction === 'ARS_TO_USD'
                      ? `US$ ${res.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : `$ ${res.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end pt-2">
          <Button variant="primary" size="md" onClick={onClose}>
            Cerrar Conversor
          </Button>
        </div>
      </div>
    </Modal>
  );
};
