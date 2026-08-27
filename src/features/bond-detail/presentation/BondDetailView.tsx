import React, { useEffect, useState } from 'react';
import { BondHeaderMetrics } from './BondHeaderMetrics';
import { InteractiveYieldCalculator } from './InteractiveYieldCalculator';
import { CashFlowScheduleTable } from './CashFlowScheduleTable';
import { ParitySpreadCard } from './ParitySpreadCard';
import { GetBondDetailUseCase } from '../application/GetBondDetailUseCase';
import { BackendBondRepository } from '../infrastructure/BackendBondRepository';
import { BondDetail } from '../domain/BondDetail';
import { Button } from '@core/ui/components/Button';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export const BondDetailView: React.FC<{
  initialTicker?: string;
  onBackToMarkets?: () => void;
  activeSubItem?: string | null;
}> = ({ initialTicker = 'AL30', onBackToMarkets, activeSubItem }) => {
  const [ticker, setTicker] = useState(initialTicker);
  const [bond, setBond] = useState<BondDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeSubItem) {
      if (activeSubItem === 'calc') {
        document.getElementById('bond-calc-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (activeSubItem === 'waterfall') {
        document.getElementById('bond-waterfall-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (activeSubItem === 'schedule') {
        document.getElementById('bond-schedule-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [activeSubItem]);

  const fetchBond = async (bondTicker: string) => {
    setLoading(true);
    const repo = new BackendBondRepository();
    const useCase = new GetBondDetailUseCase(repo);
    const result = await useCase.execute(bondTicker);
    setBond(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchBond(ticker);
  }, [ticker]);

  if (loading || !bond) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-primary" size={28} />
          <span className="font-eyebrow">
            Calculando estructura financiera del bono {ticker}...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Navigation & Bond Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-surface-container-highest shadow-tactile stroke-of-value card-interactive">
        <div className="flex items-center gap-3">
          {onBackToMarkets && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToMarkets}
              icon={<ArrowLeft size={14} />}
            >
              Volver a Mercados
            </Button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-h1 text-xl sm:text-2xl">
                {bond.ticker} · {bond.name}
              </h1>
            </div>
            <span className="font-subtitle text-xs">
              ISIN: {bond.isin} · Ley {bond.law} · Emisor: {bond.issuer}
            </span>
          </div>
        </div>

        {/* Quick Ticker Switcher */}
        <div className="flex items-center gap-2">
          <span className="font-eyebrow">
            Comparar Bono:
          </span>
          <div className="flex bg-surface-container-low p-1 rounded-xl border border-surface-container-high">
            {['AL30', 'GD30'].map((t) => (
              <button
                key={t}
                onClick={() => setTicker(t)}
                className={`px-3.5 py-1 text-xs font-sans font-bold rounded-lg transition-all ${
                  ticker === t
                    ? 'bg-primary text-white shadow-sm scale-105'
                    : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Quantitative Header Metrics */}
      <BondHeaderMetrics bond={bond} />

      {/* Interactive Yield Calculator */}
      <div id="bond-calc-section">
        <InteractiveYieldCalculator bond={bond} />
      </div>

      {/* Secondary Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div id="bond-waterfall-section" className="lg:col-span-1">
          <ParitySpreadCard bond={bond} />
        </div>
        <div id="bond-schedule-section" className="lg:col-span-2">
          <CashFlowScheduleTable cashFlows={bond.cashFlows} />
        </div>
      </div>
    </div>
  );
};
