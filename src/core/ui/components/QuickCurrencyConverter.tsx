import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { ArrowRightLeft } from 'lucide-react';

export interface QuickCurrencyConverterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DollarOption {
  type: string;
  name: string;
  rate: number;
  spread: number;
}

const DOLLAR_RATES: DollarOption[] = [
  { type: 'mep', name: 'Dólar MEP (Bolsa AL30)', rate: 1192.4, spread: 4.2 },
  { type: 'ccl', name: 'Contado con Liquidación (CCL)', rate: 1218.9, spread: 6.9 },
  { type: 'blue', name: 'Dólar Libre / Blue', rate: 1220.0, spread: 20.0 },
  { type: 'cripto', name: 'Dólar Cripto (USDT)', rate: 1215.0, spread: 4.5 },
  { type: 'oficial', name: 'Dólar Oficial (BNA)', rate: 1068.5, spread: 40.0 },
  { type: 'tarjeta', name: 'Dólar Tarjeta / Turista (60%)', rate: 1709.6, spread: 59.6 },
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
      ? [50000, 100000, 500000, 1000000]
      : [50, 100, 500, 1000];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Conversor Instantáneo de Divisas & Brecha"
      subtitle="Calcula conversiones exactas entre pesos argentinos y todos los tipos de cambio"
      maxWidth="xl"
    >
      <div className="space-y-5 font-sans text-xs">
        {/* Direction Switcher */}
        <div className="flex items-center justify-between gap-3 bg-surface-container-low dark:bg-[#0c1730] p-3.5 rounded-2xl border border-surface-container-high dark:border-[#1a2744]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary text-sm font-sans">
              {direction === 'ARS_TO_USD' ? 'Pesos a Dólares' : 'Dólares a Pesos'}
            </span>
            <Badge variant="gold" size="sm">
              COTIZACIÓN SPOT
            </Badge>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setDirection((prev) => (prev === 'ARS_TO_USD' ? 'USD_TO_ARS' : 'ARS_TO_USD'));
              setAmount(direction === 'ARS_TO_USD' ? 100 : 100000);
            }}
            icon={<ArrowRightLeft size={13} />}
          >
            Invertir Dirección
          </Button>
        </div>

        {/* Input & Dollar Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="font-eyebrow block">
              Monto a Convertir ({direction === 'ARS_TO_USD' ? '$ ARS' : 'US$ USD'})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-mono-tabular font-bold text-outline">
                {direction === 'ARS_TO_USD' ? '$' : 'US$'}
              </span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-3 py-2.5 text-sm font-mono-tabular font-bold bg-white dark:bg-[#081124] border border-surface-container-highest dark:border-[#1a2744] rounded-xl focus:outline-none focus:border-gold shadow-sm transition-all"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 pt-1.5">
              <span className="font-eyebrow text-[10px]">Rápido:</span>
              {quickPresets.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  className="text-[10px] font-mono-tabular px-2.5 py-1 bg-white dark:bg-[#0c1730] border border-surface-container-highest dark:border-[#1a2744] rounded-xl text-primary font-semibold hover:border-gold hover:-translate-y-0.5 transition-all shadow-xs"
                >
                  {direction === 'ARS_TO_USD'
                    ? `$ ${(p / 1000).toFixed(0)}k`
                    : `US$ ${p}`}
                </button>
              ))}
            </div>
          </div>

          {/* Dollar Type Selector */}
          <div className="space-y-1.5">
            <label className="font-eyebrow block">
              Tipo de Cambio Seleccionado
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-sans font-semibold bg-white dark:bg-[#081124] border border-surface-container-highest dark:border-[#1a2744] rounded-xl focus:outline-none focus:border-gold shadow-sm transition-all"
            >
              {DOLLAR_RATES.map((d) => (
                <option key={d.type} value={d.type}>
                  {d.name} — ${d.rate.toLocaleString('es-AR')}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-outline block mt-1 font-mono-tabular">
              Tipo de cambio de referencia: ${currentRateObj.rate.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Big Converted Result Display */}
        <div className="p-5 bg-primary text-white rounded-2xl border border-gold/30 shadow-tactile flex flex-col sm:flex-row items-center justify-between gap-3 stroke-of-value">
          <div>
            <span className="font-eyebrow text-gold font-bold block mb-1">
              Resultado Estimado al Tipo de Cambio {currentRateObj.name.split('(')[0]}:
            </span>
            <span className="text-2xl sm:text-3xl font-mono-tabular font-extrabold text-white tracking-tight">
              {direction === 'ARS_TO_USD'
                ? `US$ ${convertedResult.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : `$ ${convertedResult.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
          </div>

          <Badge variant="gold" size="sm">
            {direction === 'ARS_TO_USD'
              ? `1 USD = $${rate.toFixed(2)}`
              : `$1 = US$ ${(1 / rate).toFixed(4)}`}
          </Badge>
        </div>

        {/* Comparison across all dollar quotes */}
        <div className="space-y-2 pt-1">
          <span className="font-eyebrow block">
            Comparativa simultánea con todos los tipos de cambio:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
                  className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer shadow-soft ${
                    isCurrent
                      ? 'bg-champagne-light/60 dark:bg-[#101e3d] border-gold shadow-md font-bold scale-[1.02]'
                      : 'bg-white dark:bg-[#081124] hover:bg-surface-container-low border-surface-container-highest dark:border-[#1a2744] hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-outline mb-1">
                    <span className="truncate">{d.name.split(' ')[1] || d.name}</span>
                    <span className="font-mono-tabular">${d.rate.toFixed(0)}</span>
                  </div>
                  <span className="font-mono-tabular font-bold text-xs text-primary dark:text-slate-100 block">
                    {direction === 'ARS_TO_USD'
                      ? `US$ ${res.toFixed(2)}`
                      : `$ ${(res / 1000).toFixed(1)}k`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={onClose}>
            Cerrar Conversor
          </Button>
        </div>
      </div>
    </Modal>
  );
};
