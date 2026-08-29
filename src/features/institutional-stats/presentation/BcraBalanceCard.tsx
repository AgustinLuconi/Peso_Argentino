import React from 'react';
import { BcraBalanceSheet } from '../domain/BcraBalanceSheet';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { Landmark, ShieldCheck, DollarSign, Wallet, CheckCircle2, Info } from 'lucide-react';
import { useApp } from '@app/providers/AppContext';
import { Money } from '@core/domain/Money';

export const BcraBalanceCard: React.FC<{ balance: BcraBalanceSheet }> = ({
  balance,
}) => {
  const { displayCurrency, formatMoney, referenceUsdRate } = useApp();

  // Escalas y conversiones defensivas
  const grossReservesAmount = balance?.grossReservesUsd?.amount ?? 0;
  const netReservesAmount = balance?.netReservesUsd?.amount ?? 0;
  const monetaryBaseAmount = balance?.monetaryBaseArs?.amount ?? 0;
  const depositsAmount = balance?.privateDepositsUsd?.amount ?? 0;

  const grossReservesScale = Money.formatScale(grossReservesAmount, 'USD');
  const netReservesScale = Money.formatScale(netReservesAmount, 'USD');
  const monetaryBaseScale = Money.formatScale(monetaryBaseAmount, 'ARS');
  const depositsScale = Money.formatScale(depositsAmount, 'USD');

  // Equivalentes
  const mbInUsd = Money.convert(monetaryBaseAmount, 'ARS', 'USD', referenceUsdRate);
  const reservesInArs = Money.convert(grossReservesAmount, 'USD', 'ARS', referenceUsdRate);

  return (
    <Card variant="default" accent="navy" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-highest dark:border-[#1E2638] pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900 dark:bg-[#131822] text-emerald-400 border border-emerald-500/30 rounded-2xl shrink-0 shadow-soft">
            <Landmark size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-h2 text-base sm:text-lg text-slate-900 dark:text-slate-100">
                Balance General del Banco Central (BCRA)
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-md">
                {displayCurrency === 'ARS' ? 'Viendo en ARS 🇦🇷' : 'Viendo en USD 🇺🇸'}
              </span>
            </div>
            <p className="font-subtitle text-xs text-on-surface-variant dark:text-slate-300">
              Reservas internacionales, saneamiento de pasivos remunerados y agregados monetarios
            </p>
          </div>
        </div>

        <Badge variant="emerald" size="sm">
          PASIVOS SANEADOS (PASES $0)
        </Badge>
      </div>

      {/* Grid of Key Balance Sheet Components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Gross Reserves */}
        <div className="p-4 bg-surface-container-low dark:bg-[#0F141C] rounded-2xl border border-surface-container-high dark:border-[#1E2638] space-y-1.5 hover:-translate-y-1 transition-all duration-200 shadow-soft min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-outline dark:text-slate-400 text-[10px] uppercase font-bold">
            <span className="font-eyebrow">Reservas Brutas</span>
            <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[9px] font-mono font-bold">
              {grossReservesScale.scaleLabel}
            </span>
          </div>
          <span className="text-lg sm:text-xl xl:text-2xl font-mono-tabular font-extrabold text-slate-900 dark:text-slate-100 block truncate tracking-tight">
            {displayCurrency === 'USD'
              ? grossReservesScale.formatted
              : reservesInArs.format({ compact: true })}
          </span>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium flex items-center justify-between gap-1 min-w-0 truncate">
            <span className="truncate">+US$ 145 M última rueda</span>
            <span className="text-[10px] text-on-surface-variant dark:text-slate-400 truncate shrink-0">
              {displayCurrency === 'USD' ? `≈ ${reservesInArs.format({ compact: true })}` : `≈ ${grossReservesScale.formatted}`}
            </span>
          </div>
        </div>

        {/* Net Reserves */}
        <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 space-y-1.5 hover:-translate-y-1 transition-all duration-200 shadow-soft min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-400 text-[10px] uppercase font-bold">
            <span className="font-eyebrow text-emerald-800 dark:text-emerald-400 font-bold">Reservas Netas</span>
            <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-mono font-bold">
              {netReservesScale.scaleLabel}
            </span>
          </div>
          <span className="text-lg sm:text-xl xl:text-2xl font-mono-tabular font-extrabold text-emerald-600 dark:text-emerald-400 block truncate tracking-tight">
            {displayCurrency === 'USD'
              ? netReservesScale.formatted
              : Money.convert(balance?.netReservesUsd?.amount ?? 0, 'USD', 'ARS', referenceUsdRate).format({ compact: true })}
          </span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-sans font-medium block truncate">
            Superávit en terreno positivo
          </span>
        </div>

        {/* Monetary Base */}
        <div className="p-4 bg-surface-container-low dark:bg-[#0F141C] rounded-2xl border border-surface-container-high dark:border-[#1E2638] space-y-1.5 hover:-translate-y-1 transition-all duration-200 shadow-soft min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-outline dark:text-slate-400 text-[10px] uppercase font-bold">
            <span className="font-eyebrow">Base Monetaria</span>
            <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[9px] font-mono font-bold">
              {displayCurrency === 'ARS' ? monetaryBaseScale.scaleLabel : 'Millones USD'}
            </span>
          </div>
          <span className="text-lg sm:text-xl xl:text-2xl font-mono-tabular font-extrabold text-slate-900 dark:text-slate-100 block truncate tracking-tight">
            {displayCurrency === 'ARS'
              ? monetaryBaseScale.formatted
              : mbInUsd.format({ compact: true })}
          </span>
          <div className="text-[11px] text-on-surface-variant dark:text-slate-400 font-mono flex items-center justify-between gap-1 min-w-0 truncate">
            <span className="truncate">Circulante + Encajes</span>
            <span className="text-[10px] truncate shrink-0">
              {displayCurrency === 'ARS' ? `≈ ${mbInUsd.format({ compact: true })}` : `≈ ${monetaryBaseScale.formatted}`}
            </span>
          </div>
        </div>

        {/* Private Deposits USD */}
        <div className="p-4 bg-emerald-500/5 dark:bg-[#0F141C] rounded-2xl border border-emerald-500/30 space-y-1.5 hover:-translate-y-1 transition-all duration-200 shadow-soft min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-[10px] uppercase font-bold">
            <span className="font-eyebrow text-emerald-700 dark:text-emerald-400 font-bold">Depósitos Privados USD</span>
            <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-mono font-bold">
              {depositsScale.scaleLabel}
            </span>
          </div>
          <span className="text-lg sm:text-xl xl:text-2xl font-mono-tabular font-extrabold text-slate-900 dark:text-emerald-400 block truncate tracking-tight">
            {displayCurrency === 'USD'
              ? depositsScale.formatted
              : Money.convert(balance?.privateDepositsUsd?.amount ?? 0, 'USD', 'ARS', referenceUsdRate).format({ compact: true })}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-slate-400 font-mono block truncate">
            Máximo histórico de la década
          </span>
        </div>
      </div>

      {/* Detailed Balance Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        <div className="p-4 bg-white dark:bg-[#0F141C] border border-surface-container-highest dark:border-[#1E2638] rounded-2xl space-y-2.5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="font-eyebrow text-xs text-slate-900 dark:text-slate-100 font-bold uppercase tracking-wide block">
              Desglose de la Base Monetaria
            </span>
            <span className="text-[10px] font-mono text-outline dark:text-slate-400">
              Escala Larga: 1 Billón = 10¹² ARS
            </span>
          </div>
          <div className="flex justify-between items-center text-xs py-1 border-b border-surface-container-high dark:border-[#1E2638]">
            <span className="text-on-surface-variant dark:text-slate-300 font-sans">Billetes y Monedas en Poder del Público:</span>
            <span className="font-mono-tabular font-bold text-slate-900 dark:text-slate-100">
              {formatMoney(balance?.circulatingCashArs?.amount ?? 0, 'ARS')}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs py-1">
            <span className="text-on-surface-variant dark:text-slate-300 font-sans">Encajes / Cuenta Corriente Bancos en BCRA:</span>
            <span className="font-mono-tabular font-bold text-slate-900 dark:text-slate-100">
              {formatMoney(balance?.bankReservesArs?.amount ?? 0, 'ARS')}
            </span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#0F141C] border border-surface-container-highest dark:border-[#1E2638] rounded-2xl space-y-2.5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="font-eyebrow text-xs text-slate-900 dark:text-slate-100 font-bold uppercase tracking-wide block">
              Esquema de Pasivos & Absorción
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              ✓ Emisión Cero
            </span>
          </div>
          <div className="flex justify-between items-center text-xs py-1 border-b border-surface-container-high dark:border-[#1E2638]">
            <span className="text-on-surface-variant dark:text-slate-300 font-sans">Stock de Pases Pasivos BCRA:</span>
            <span className="font-mono-tabular font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={13} /> $0 (Eliminados)
            </span>
          </div>
          <div className="flex justify-between items-center text-xs py-1">
            <span className="text-on-surface-variant dark:text-slate-300 font-sans">LEFIs del Tesoro (Absorción de Liquidez):</span>
            <span className="font-mono-tabular font-bold text-slate-900 dark:text-slate-100">
              {formatMoney(balance?.lefiTreasuryArs?.amount ?? 0, 'ARS')}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
