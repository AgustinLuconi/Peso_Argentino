import React, { useState, useMemo } from 'react';
import { BondDetail } from '../domain/BondDetail';
import { YieldCalculationEngine } from '../domain/YieldCalculationEngine';
import { CashFlowWaterfallChart } from './CashFlowWaterfallChart';
import { Card } from '@core/ui/components/Card';
import { Button } from '@core/ui/components/Button';
import { Badge } from '@core/ui/components/Badge';
import { Calculator, Copy, Check } from 'lucide-react';

export const InteractiveYieldCalculator: React.FC<{ bond: BondDetail }> = ({
  bond,
}) => {
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [amountInput, setAmountInput] = useState<number>(5000);
  const [copied, setCopied] = useState(false);

  const simulation = useMemo(() => {
    return YieldCalculationEngine.simulateInvestment(
      bond,
      amountInput || 0,
      currency
    );
  }, [bond, amountInput, currency]);

  const presetAmounts =
    currency === 'USD'
      ? [1000, 2500, 5000, 10000, 25000]
      : [500000, 1000000, 2500000, 5000000, 10000000];

  const handleCopySummary = () => {
    const text = `Simulación ${bond.ticker} (${bond.name}):
- Inversión: ${currency === 'USD' ? 'US$' : '$'} ${amountInput.toLocaleString('es-AR')}
- Títulos comprados: ${simulation.nominalBondsPurchased.toLocaleString('es-AR')} V.N.
- Costo USD: US$ ${simulation.totalCostUsd.toFixed(2)}
- Cobro Proyectado: US$ ${simulation.totalCashFlowToCollectUsd.toFixed(2)}
- Ganancia Neta USD: +US$ ${simulation.netProfitUsd.toFixed(2)} (+${simulation.totalRoiPercentage.toFixed(1)}% ROI)
- TIR: ${bond.tir.format()} | Paridad: ${bond.parity.format()}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sliderMax = currency === 'USD' ? 50000 : 20000000;
  const sliderStep = currency === 'USD' ? 250 : 100000;

  return (
    <Card variant="default" accent="gold" className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-highest pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary text-gold rounded-xl shrink-0 shadow-sm">
            <Calculator size={18} />
          </div>
          <div>
            <h3 className="font-h3 text-base sm:text-lg text-primary">
              Calculadora Interactiva de Rendimiento & Flujo de Fondos
            </h3>
            <p className="font-subtitle text-xs">
              Simula tu retorno en dólares cobrando todos los cupones y amortizaciones hasta 2030
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopySummary}
            icon={copied ? <Check size={13} className="text-bullish-green" /> : <Copy size={13} />}
          >
            {copied ? 'Copiado' : 'Copiar Resumen'}
          </Button>
          <Badge variant="bullish" size="sm">
            TIR {bond.tir.format({ showSign: false })}
          </Badge>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-surface-container-high">
        {/* Currency Switcher */}
        <div className="space-y-1.5">
          <label className="font-eyebrow block">
            Moneda de Inversión
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setCurrency('USD');
                setAmountInput(5000);
              }}
              className={`py-2 text-xs font-sans font-bold rounded-xl border transition-all duration-200 ${
                currency === 'USD'
                  ? 'bg-primary text-white border-primary shadow-sm scale-[1.02]'
                  : 'bg-white text-on-surface hover:bg-surface-container border-surface-container-highest'
              }`}
            >
              Dólares (US$)
            </button>
            <button
              onClick={() => {
                setCurrency('ARS');
                setAmountInput(5000000);
              }}
              className={`py-2 text-xs font-sans font-bold rounded-xl border transition-all duration-200 ${
                currency === 'ARS'
                  ? 'bg-primary text-white border-primary shadow-sm scale-[1.02]'
                  : 'bg-white text-on-surface hover:bg-surface-container border-surface-container-highest'
              }`}
            >
              Pesos ($ ARS)
            </button>
          </div>
        </div>

        {/* Investment Amount Input & Tactile Slider */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="font-eyebrow">
              Monto a Invertir ({currency === 'USD' ? 'US$' : '$ ARS'})
            </label>
            <span className="text-xs font-mono-tabular font-bold text-primary">
              {currency === 'USD'
                ? `US$ ${amountInput.toLocaleString('es-AR')}`
                : `$ ${amountInput.toLocaleString('es-AR')}`}
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-outline">
              {currency === 'USD' ? 'US$' : '$'}
            </span>
            <input
              type="number"
              min="1"
              value={amountInput}
              onChange={(e) => setAmountInput(parseFloat(e.target.value) || 0)}
              className="w-full pl-10 pr-3 py-2 text-sm font-mono-tabular bg-white dark:bg-[#0c1730] border border-surface-container-highest rounded-xl focus:outline-none focus:border-gold shadow-sm transition-all"
            />
          </div>

          {/* Tactile Range Slider */}
          <input
            type="range"
            min={currency === 'USD' ? 100 : 100000}
            max={sliderMax}
            step={sliderStep}
            value={amountInput}
            onChange={(e) => setAmountInput(parseFloat(e.target.value))}
            className="w-full h-2 bg-surface-container-high rounded-full cursor-pointer transition-all"
          />

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
            <span className="font-eyebrow text-[10px]">Montos rápidos:</span>
            {presetAmounts.map((p) => (
              <button
                key={p}
                onClick={() => setAmountInput(p)}
                className={`text-[10px] font-mono-tabular px-2.5 py-1 rounded-xl border transition-all ${
                  amountInput === p
                    ? 'bg-gold text-primary font-bold border-gold shadow-xs'
                    : 'bg-white dark:bg-[#0c1730] border-surface-container-highest text-primary font-semibold hover:border-gold hover:-translate-y-0.5'
                }`}
              >
                {currency === 'USD'
                  ? `US$ ${p.toLocaleString()}`
                  : `$ ${(p / 1000000).toFixed(1)}M`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projection Results Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container-high hover:-translate-y-1 transition-all duration-200 shadow-soft">
          <span className="font-eyebrow block mb-1">
            Nominales Comprados (V.N.)
          </span>
          <span className="text-lg sm:text-xl font-mono-tabular font-bold text-primary block">
            {simulation.nominalBondsPurchased.toLocaleString('es-AR')}
          </span>
          <span className="text-[10px] text-outline block mt-0.5">Títulos en cartera</span>
        </div>

        <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container-high hover:-translate-y-1 transition-all duration-200 shadow-soft">
          <span className="font-eyebrow block mb-1">
            Costo Efectivo USD
          </span>
          <span className="text-lg sm:text-xl font-mono-tabular font-bold text-primary block">
            US$ {simulation.totalCostUsd.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-outline block mt-0.5">Capital invertido</span>
        </div>

        <div className="p-4 bg-champagne-light/60 dark:bg-[#101e3d] rounded-2xl border border-gold/40 hover:-translate-y-1 transition-all duration-200 shadow-soft">
          <span className="font-eyebrow text-secondary font-bold block mb-1">
            Cobro Total Proyectado
          </span>
          <span className="text-lg sm:text-xl font-mono-tabular font-bold text-primary block">
            US$ {simulation.totalCashFlowToCollectUsd.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-secondary block mt-0.5">Cupones + Amortización</span>
        </div>

        <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800 hover:-translate-y-1 transition-all duration-200 shadow-soft">
          <span className="font-eyebrow text-bullish-green font-bold block mb-1">
            Ganancia Neta en USD
          </span>
          <span className="text-lg sm:text-xl font-mono-tabular font-bold text-bullish-green block">
            +US$ {simulation.netProfitUsd.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-teal-700 dark:text-teal-400 block mt-0.5">
            Retorno: +{simulation.totalRoiPercentage.toFixed(1)}% total
          </span>
        </div>
      </div>

      {/* Cash Flow Waterfall Graphic Chart */}
      <CashFlowWaterfallChart
        cashFlows={bond.cashFlows}
        nominalBonds={simulation.nominalBondsPurchased}
      />
    </Card>
  );
};
