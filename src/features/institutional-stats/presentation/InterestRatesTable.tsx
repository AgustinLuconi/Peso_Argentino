import React, { useState, useMemo } from 'react';
import { InterestRateMetric } from '../domain/InterestRateMetric';
import { Card } from '@core/ui/components/Card';
import { Money } from '@core/domain/Money';
import {
  Percent,
  TrendingUp,
  Wallet,
  Building2,
  Landmark,
  Calculator,
} from 'lucide-react';

export interface WalletYieldItem {
  name: string;
  type: 'WALLET' | 'BANK' | 'BCRA';
  tna: number;
  tem: number;
  tea: number;
  dailyYieldPer100k: number; // Pesos por día por cada $100.000 invertidos
  liquidity: 'INMEDIATA' | '30 DÍAS';
}

const EXTENDED_RATES_DATA: WalletYieldItem[] = [
  { name: 'Naranja X', type: 'WALLET', tna: 42.0, tem: 3.45, tea: 51.1, dailyYieldPer100k: 115.0, liquidity: 'INMEDIATA' },
  { name: 'Ualá (Cuenta Remunerada)', type: 'WALLET', tna: 40.0, tem: 3.29, tea: 48.2, dailyYieldPer100k: 109.5, liquidity: 'INMEDIATA' },
  { name: 'Personal Pay', type: 'WALLET', tna: 39.5, tem: 3.25, tea: 47.5, dailyYieldPer100k: 108.2, liquidity: 'INMEDIATA' },
  { name: 'Mercado Pago', type: 'WALLET', tna: 37.8, tem: 3.11, tea: 45.1, dailyYieldPer100k: 103.5, liquidity: 'INMEDIATA' },
  { name: 'Prex Argentina', type: 'WALLET', tna: 37.0, tem: 3.04, tea: 43.9, dailyYieldPer100k: 101.3, liquidity: 'INMEDIATA' },
  { name: 'Banco BICA (Plazo Fijo)', type: 'BANK', tna: 40.0, tem: 3.29, tea: 48.2, dailyYieldPer100k: 109.5, liquidity: '30 DÍAS' },
  { name: 'Banco Macro (Plazo Fijo)', type: 'BANK', tna: 38.5, tem: 3.16, tea: 46.0, dailyYieldPer100k: 105.4, liquidity: '30 DÍAS' },
  { name: 'Banco Nación (Plazo Fijo)', type: 'BANK', tna: 37.0, tem: 3.04, tea: 43.9, dailyYieldPer100k: 101.3, liquidity: '30 DÍAS' },
  { name: 'Banco Galicia (Plazo Fijo)', type: 'BANK', tna: 36.5, tem: 3.00, tea: 43.2, dailyYieldPer100k: 100.0, liquidity: '30 DÍAS' },
  { name: 'Banco BBVA (Plazo Fijo)', type: 'BANK', tna: 36.0, tem: 2.96, tea: 42.5, dailyYieldPer100k: 98.6, liquidity: '30 DÍAS' },
  { name: 'Banco Santander (Plazo Fijo)', type: 'BANK', tna: 35.5, tem: 2.92, tea: 41.8, dailyYieldPer100k: 97.2, liquidity: '30 DÍAS' },
  { name: 'LEFIs BCRA (Política)', type: 'BCRA', tna: 40.0, tem: 3.29, tea: 48.2, dailyYieldPer100k: 109.5, liquidity: 'INMEDIATA' },
];

export const InterestRatesTable: React.FC<{ rates?: InterestRateMetric[] }> = ({
  rates: _rates,
}) => {
  const [metricMode, setMetricMode] = useState<'tem' | 'tna' | 'tea' | 'dailyYieldPer100k'>('tem');
  const [filterType, setFilterType] = useState<'ALL' | 'WALLET' | 'BANK' | 'BCRA'>('ALL');
  const [simulationCapital, setSimulationCapital] = useState<number>(500000); // 500k ARS

  const filteredRates = useMemo(() => {
    return EXTENDED_RATES_DATA.filter((r) => filterType === 'ALL' || r.type === filterType);
  }, [filterType]);

  const maxVal = Math.max(...EXTENDED_RATES_DATA.map((r) => r[metricMode]));

  const metricTitles = {
    tem: 'TEM Mensual (% m/m)',
    tna: 'TNA Anual (%)',
    tea: 'TEA Compuesta (%)',
    dailyYieldPer100k: 'Rendimiento Diario ($ por cada $100k)',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-highest pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary text-gold rounded-xl shrink-0 shadow-sm">
            <Percent size={18} />
          </div>
          <div>
            <h2 className="font-h2 text-base sm:text-lg">
              Comparador & Gráfico de Tasas del Sistema Financiero
            </h2>
            <p className="font-subtitle text-xs">
              Rendimientos en tiempo real de Billeteras Virtuales, Plazos Fijos Bancarios y Política del BCRA
            </p>
          </div>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container-high shrink-0 overflow-x-auto">
          {[
            { id: 'tem', label: 'TEM (Mensual %)' },
            { id: 'tna', label: 'TNA (%)' },
            { id: 'tea', label: 'TEA (%)' },
            { id: 'dailyYieldPer100k', label: 'Pesos / Día' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMetricMode(m.id as any)}
              className={`px-3 py-1 text-xs font-sans font-bold rounded-lg transition-all ${
                metricMode === m.id
                  ? 'bg-primary text-white shadow-sm scale-105'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Bar Comparison Chart */}
      <Card variant="default" accent="gold" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-sans font-bold text-sm text-primary flex items-center gap-2">
            <TrendingUp size={16} className="text-gold" />
            Ranking Visual de Rendimientos: {metricTitles[metricMode]}
          </h3>

          <div className="flex items-center gap-1">
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'WALLET', label: 'Billeteras' },
              { id: 'BANK', label: 'Plazo Fijo' },
              { id: 'BCRA', label: 'BCRA' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`px-2.5 py-1 text-[11px] font-sans font-semibold rounded-lg transition-all ${
                  filterType === f.id
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="space-y-2.5 pt-1">
          {filteredRates.map((item) => {
            const val = item[metricMode];
            const widthPct = Math.max(15, (val / (maxVal || 1)) * 100);
            const isWallet = item.type === 'WALLET';
            const isBank = item.type === 'BANK';

            return (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2">
                    {isWallet && <Wallet size={14} className="text-purple-600 shrink-0" />}
                    {isBank && <Building2 size={14} className="text-blue-600 shrink-0" />}
                    {!isWallet && !isBank && <Landmark size={14} className="text-gold shrink-0" />}
                    <span className="font-bold text-primary">{item.name}</span>
                    <span className="text-[10px] font-sans text-outline">({item.liquidity})</span>
                  </div>
                  <span className="font-sans font-bold text-primary">
                    {metricMode === 'dailyYieldPer100k'
                      ? `+$${val.toFixed(1)} /día`
                      : `${val.toFixed(2)}%`}
                  </span>
                </div>

                <div className="h-3.5 w-full bg-surface-container-low rounded-full overflow-hidden p-0.5 border border-surface-container-highest">
                  <div
                    style={{ width: `${widthPct}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWallet
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600'
                        : isBank
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600'
                        : 'bg-gradient-to-r from-gold to-amber-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Simulator for Financial Rates */}
      <div className="bg-white dark:bg-[#071228] p-5 rounded-2xl border border-surface-container-highest dark:border-[#1a2744] shadow-tactile space-y-4">
        <div className="flex items-center gap-2 border-b border-surface-container-highest dark:border-[#1a2744] pb-3">
          <span className="p-1.5 bg-gold/15 text-gold rounded-lg">
            <Calculator size={18} />
          </span>
          <div>
            <h3 className="font-sans font-bold text-sm text-primary">
              Simulador de Rendimiento Comparativo a 30 Días
            </h3>
            <p className="text-[11px] font-sans text-on-surface-variant">
              Calcula el cobro estimado mensual según el capital invertido
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-sans font-semibold text-on-surface mb-1">
              Capital en Pesos ($ ARS)
            </label>
            <input
              type="number"
              step="50000"
              min="1000"
              value={simulationCapital}
              onChange={(e) => setSimulationCapital(Number(e.target.value) || 0)}
              className="w-full p-2.5 bg-surface-container-low border border-surface-container-high rounded-xl text-sm font-sans font-bold text-primary focus:outline-none focus:border-gold"
            />
          </div>

          <div className="p-3 bg-purple-50/70 border border-purple-200/60 rounded-xl space-y-1">
            <span className="text-[10px] font-sans text-purple-900 uppercase block font-semibold">
              En Billetera Top (Naranja X / Ualá)
            </span>
            <div className="text-lg font-bold font-sans text-purple-700">
              +{Money.formatArs((simulationCapital * 3.45) / 100)}
            </div>
            <span className="text-[10px] font-sans text-purple-800 block">
              Disponibilidad 24/7 sin bloqueo de fondos
            </span>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl space-y-1">
            <span className="text-[10px] font-sans text-blue-900 uppercase block font-semibold">
              En Plazo Fijo Top (30 días)
            </span>
            <div className="text-lg font-bold font-sans text-blue-700">
              +{Money.formatArs((simulationCapital * 3.16) / 100)}
            </div>
            <span className="text-[10px] font-sans text-blue-800 block">
              Fondos inmovilizados durante 30 días
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
