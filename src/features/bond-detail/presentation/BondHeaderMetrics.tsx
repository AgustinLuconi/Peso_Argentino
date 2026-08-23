import React from 'react';
import { BondDetail } from '../domain/BondDetail';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';

export const BondHeaderMetrics: React.FC<{ bond: BondDetail }> = ({ bond }) => {
  return (
    <Card variant="navy" accent="gold" className="text-white space-y-5">
      {/* Top Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-h1 text-2xl sm:text-3xl text-white">
              {bond.ticker}
            </span>
            <Badge variant="gold" size="sm">
              {bond.isin}
            </Badge>
            <Badge variant="navy" size="sm">
              {bond.law}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1">
            {bond.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="font-eyebrow text-slate-400 block mb-0.5">
              Cotización en MEP
            </span>
            <span className="text-2xl font-mono-tabular font-extrabold text-gold">
              {bond.priceMep.format()}
            </span>
          </div>
          <div className="text-right pl-3 border-l border-white/15">
            <span className="font-eyebrow text-slate-400 block mb-0.5">
              Cotización en ARS
            </span>
            <span className="text-xl font-mono-tabular font-bold text-white">
              {bond.priceArs.format()}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Key Sovereign Debt Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-3.5 bg-primary/60 rounded-2xl border border-gold/20 shadow-soft">
          <span className="font-eyebrow text-slate-400 block mb-1">Paridad</span>
          <span className="text-lg font-mono-tabular font-bold text-gold">
            {bond.parity.format({ showSign: false })}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Sobre V.T.</span>
        </div>

        <div className="p-3.5 bg-primary/60 rounded-2xl border border-gold/20 shadow-soft">
          <span className="font-eyebrow text-slate-400 block mb-1">TIR Anual</span>
          <span className="text-lg font-mono-tabular font-bold text-bullish-green bg-teal-950/60 px-1 rounded inline-block">
            {bond.tir.format({ showSign: false })}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Tasa Interna Retorno</span>
        </div>

        <div className="p-3.5 bg-primary/60 rounded-2xl border border-gold/20 shadow-soft">
          <span className="font-eyebrow text-slate-400 block mb-1">Modified Duration</span>
          <span className="text-lg font-mono-tabular font-bold text-white">
            {bond.modifiedDuration} años
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Sensibilidad tasa</span>
        </div>

        <div className="p-3.5 bg-primary/60 rounded-2xl border border-gold/20 shadow-soft">
          <span className="font-eyebrow text-slate-400 block mb-1">Dólar Implícito MEP</span>
          <span className="text-lg font-mono-tabular font-bold text-white">
            ${bond.implicitMepDollar.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">AL30 / AL30D</span>
        </div>

        <div className="p-3.5 bg-primary/60 rounded-2xl border border-gold/20 shadow-soft">
          <span className="font-eyebrow text-slate-400 block mb-1">Vencimiento</span>
          <span className="text-base font-mono-tabular font-bold text-white">
            {bond.maturityDate}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Amortización total</span>
        </div>

        <div className="p-3.5 bg-primary/60 rounded-2xl border border-gold/20 shadow-soft">
          <span className="font-eyebrow text-slate-400 block mb-1">Cupón Vigente</span>
          <span className="text-lg font-mono-tabular font-bold text-gold">
            {bond.couponRate.format({ showSign: false })}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Step-up semestral</span>
        </div>
      </div>
    </Card>
  );
};
