import React from 'react';
import { BcraBalanceSheet } from '../domain/BcraBalanceSheet';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { Landmark, ShieldCheck, DollarSign, Wallet, CheckCircle2 } from 'lucide-react';

export const BcraBalanceCard: React.FC<{ balance: BcraBalanceSheet }> = ({
  balance,
}) => {
  return (
    <Card variant="default" accent="navy" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-highest pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary text-gold rounded-2xl shrink-0 shadow-soft">
            <Landmark size={20} />
          </div>
          <div>
            <h2 className="font-h2 text-base sm:text-lg">
              Balance General del Banco Central (BCRA)
            </h2>
            <p className="font-subtitle text-xs">
              Reservas internacionales, saneamiento de pasivos remunerados y base monetaria
            </p>
          </div>
        </div>

        <Badge variant="navy" size="sm">
          PASIVOS SANEADOS (PASES $0)
        </Badge>
      </div>

      {/* Grid of Key Balance Sheet Components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Gross Reserves */}
        <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container-high space-y-1.5 hover:-translate-y-1 transition-all duration-200 shadow-soft">
          <div className="flex items-center justify-between text-outline text-[10px] uppercase font-bold">
            <span className="font-eyebrow">Reservas Brutas</span>
            <DollarSign size={14} className="text-bullish-green" />
          </div>
          <span className="text-xl sm:text-2xl font-mono-tabular font-extrabold text-primary block">
            {balance.grossReservesUsd.format({ compact: true })}
          </span>
          <span className="text-[11px] text-bullish-green font-mono font-medium block">
            +US$ 145 M última rueda
          </span>
        </div>

        {/* Net Reserves */}
        <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200/60 space-y-1.5 hover:-translate-y-1 transition-all duration-200 shadow-soft">
          <div className="flex items-center justify-between text-teal-800 text-[10px] uppercase font-bold">
            <span className="font-eyebrow text-teal-800">Reservas Netas</span>
            <ShieldCheck size={14} className="text-bullish-green" />
          </div>
          <span className="text-xl sm:text-2xl font-mono-tabular font-extrabold text-bullish-green block">
            {balance.netReservesUsd.format({ compact: true })}
          </span>
          <span className="text-[11px] text-teal-700 font-sans font-medium block">
            Superávit en terreno positivo
          </span>
        </div>

        {/* Monetary Base */}
        <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container-high space-y-1.5 hover:-translate-y-1 transition-all duration-200 shadow-soft">
          <div className="flex items-center justify-between text-outline text-[10px] uppercase font-bold">
            <span className="font-eyebrow">Base Monetaria</span>
            <Wallet size={14} className="text-secondary" />
          </div>
          <span className="text-xl sm:text-2xl font-mono-tabular font-extrabold text-primary block">
            {balance.monetaryBaseArs.format({ compact: true })}
          </span>
          <span className="text-[11px] text-on-surface-variant font-mono block">
            Circulante + Encajes
          </span>
        </div>

        {/* Private Deposits USD */}
        <div className="p-4 bg-champagne-light/50 rounded-2xl border border-gold/40 space-y-1.5 hover:-translate-y-1 transition-all duration-200 shadow-soft">
          <div className="flex items-center justify-between text-secondary text-[10px] uppercase font-bold">
            <span className="font-eyebrow text-secondary">Depósitos Privados USD</span>
            <DollarSign size={14} className="text-gold-dark" />
          </div>
          <span className="text-xl sm:text-2xl font-mono-tabular font-extrabold text-primary block">
            {balance.privateDepositsUsd.format({ compact: true })}
          </span>
          <span className="text-[11px] text-secondary font-mono block">
            Máximo de la última década
          </span>
        </div>
      </div>

      {/* Detailed Balance Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        <div className="p-4 bg-white border border-surface-container-highest rounded-2xl space-y-2.5 shadow-soft">
          <span className="font-eyebrow text-xs text-primary font-bold uppercase tracking-wide block">
            Desglose de la Base Monetaria
          </span>
          <div className="flex justify-between items-center text-xs py-1 border-b border-surface-container-high">
            <span className="text-on-surface-variant font-sans">Billetes y Monedas en Poder del Público:</span>
            <span className="font-mono-tabular font-bold text-primary">{balance.circulatingCashArs.format({ compact: true })}</span>
          </div>
          <div className="flex justify-between items-center text-xs py-1">
            <span className="text-on-surface-variant font-sans">Encajes / Cuenta Corriente Bancos en BCRA:</span>
            <span className="font-mono-tabular font-bold text-primary">{balance.bankReservesArs.format({ compact: true })}</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-surface-container-highest rounded-2xl space-y-2.5 shadow-soft">
          <span className="font-eyebrow text-xs text-primary font-bold uppercase tracking-wide block">
            Esquema de Pasivos & Absorción
          </span>
          <div className="flex justify-between items-center text-xs py-1 border-b border-surface-container-high">
            <span className="text-on-surface-variant font-sans">Stock de Pases Pasivos BCRA:</span>
            <span className="font-mono-tabular font-bold text-bullish-green flex items-center gap-1">
              <CheckCircle2 size={13} /> $0 (Eliminados)
            </span>
          </div>
          <div className="flex justify-between items-center text-xs py-1">
            <span className="text-on-surface-variant font-sans">LEFIs del Tesoro (Absorción de Liquidez):</span>
            <span className="font-mono-tabular font-bold text-primary">{balance.lefiTreasuryArs.format({ compact: true })}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
