import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { ShieldCheck, AlertTriangle, ArrowUpRight, Gauge, Info } from 'lucide-react';
import { useApp } from '@app/providers/AppContext';

export interface BrechaGaugeCardProps {
  officialPrice?: number;
  cclPrice?: number;
  bluePrice?: number;
}

export const BrechaGaugeCard: React.FC<BrechaGaugeCardProps> = ({
  officialPrice = 1080,
  cclPrice = 1350,
  bluePrice = 1380,
}) => {
  const official = officialPrice > 0 ? officialPrice : 1080;
  const ccl = cclPrice > 0 ? cclPrice : 1350;
  const blue = bluePrice > 0 ? bluePrice : 1380;

  // Cálculo de brecha Oficial vs CCL
  const brechaCclPercent = official > 0 ? ((ccl - official) / official) * 100 : 0;
  const brechaBluePercent = official > 0 ? ((blue - official) / official) * 100 : 0;

  // Rango del velocímetro: 0% a 100% (mapeado a 180 grados: -90° a +90°)
  // Si la brecha supera el 100%, la aguja se mantiene al tope (90°)
  const clampedBrecha = Math.min(Math.max(brechaCclPercent, 0), 100);
  const needleAngle = -90 + (clampedBrecha / 100) * 180;

  // Determinación de estado
  let statusBadge: { label: string; variant: 'emerald' | 'warning' | 'bearish'; icon: React.ReactNode };
  if (brechaCclPercent < 20) {
    statusBadge = {
      label: 'COMPRESIÓN HISTÓRICA (<20%)',
      variant: 'emerald',
      icon: <ShieldCheck size={12} />,
    };
  } else if (brechaCclPercent <= 45) {
    statusBadge = {
      label: 'BRECHA MODERADA (20-45%)',
      variant: 'warning',
      icon: <Info size={12} />,
    };
  } else {
    statusBadge = {
      label: 'TENSIÓN CAMBIARIA (>45%)',
      variant: 'bearish',
      icon: <AlertTriangle size={12} />,
    };
  }

  return (
    <Card variant="default" className="p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-container-highest dark:border-[#1E2638] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Gauge size={18} />
          </div>
          <div>
            <h3 className="font-h3 text-sm sm:text-base text-slate-900 dark:text-slate-100 font-bold">
              Termómetro de Brecha Cambiaria
            </h3>
            <p className="font-subtitle text-[11px] text-slate-500 dark:text-slate-400">
              Dólar Oficial Mayorista vs. Contado con Liquidación (CCL)
            </p>
          </div>
        </div>

        <Badge variant={statusBadge.variant} size="sm">
          <span className="flex items-center gap-1">
            {statusBadge.icon}
            {statusBadge.label}
          </span>
        </Badge>
      </div>

      {/* Semicircular Gauge Graphic */}
      <div className="flex flex-col items-center justify-center py-2 relative">
        <div className="relative w-64 h-32 flex items-end justify-center overflow-hidden">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            {/* Arco Fondo / Zonas de Riesgo */}
            {/* Zona Verde (<20%) -> 0° a 36° (180 to 144) */}
            <path
              d="M 20 100 A 80 80 0 0 1 45.4 43.4"
              fill="none"
              stroke="#10B981"
              strokeWidth="16"
              strokeLinecap="round"
              className="opacity-80"
            />
            {/* Zona Amarilla (20-50%) -> 36° a 90° (144 to 90) */}
            <path
              d="M 45.4 43.4 A 80 80 0 0 1 100 20"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="16"
              className="opacity-80"
            />
            {/* Zona Naranja / Roja (>50%) -> 90° a 180° (90 to 0) */}
            <path
              d="M 100 20 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#EF4444"
              strokeWidth="16"
              strokeLinecap="round"
              className="opacity-80"
            />

            {/* Arco sutil de carril interno */}
            <path
              d="M 35 100 A 65 65 0 0 1 165 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2,3"
              className="text-slate-300 dark:text-slate-700"
            />

            {/* Aguja Dinámica */}
            <g
              transform={`rotate(${needleAngle} 100 100)`}
              className="transition-transform duration-700 ease-out"
            >
              <polygon points="98,100 102,100 100,28" fill="#10B981" />
              <circle cx="100" cy="100" r="6" fill="#10B981" />
              <circle cx="100" cy="100" r="2.5" fill="#FFFFFF" />
            </g>
          </svg>

          {/* Marcador central de valor actual */}
          <div className="absolute bottom-0 text-center">
            <span className="text-2xl sm:text-3xl font-mono-tabular font-extrabold text-slate-900 dark:text-emerald-400 block leading-none">
              {brechaCclPercent.toFixed(1)}%
            </span>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Brecha CCL
            </span>
          </div>
        </div>

        {/* Leyenda de Zonas */}
        <div className="flex items-center justify-between w-full max-w-xs text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-3 px-2">
          <span className="flex items-center gap-1 text-emerald-500 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> 0% - 20%
          </span>
          <span className="flex items-center gap-1 text-amber-500 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 20% - 45%
          </span>
          <span className="flex items-center gap-1 text-rose-500 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> &gt;45%
          </span>
        </div>
      </div>

      {/* Grid de Cotizaciones que componen la brecha */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-surface-container-highest dark:border-[#1E2638]">
        <div className="p-2.5 bg-surface-container-low dark:bg-[#131822] rounded-xl border border-surface-container-high dark:border-[#1E2638] text-center space-y-0.5">
          <span className="text-[10px] font-sans uppercase font-bold text-slate-500 dark:text-slate-400 block truncate">
            Oficial Mayorista
          </span>
          <span className="text-xs sm:text-sm font-mono font-extrabold text-slate-900 dark:text-slate-100 block">
            ${official.toLocaleString('es-AR')}
          </span>
          <span className="text-[9px] font-mono text-slate-400">A3500 BCRA</span>
        </div>

        <div className="p-2.5 bg-surface-container-low dark:bg-[#131822] rounded-xl border border-surface-container-high dark:border-[#1E2638] text-center space-y-0.5">
          <span className="text-[10px] font-sans uppercase font-bold text-slate-500 dark:text-slate-400 block truncate">
            CCL Financiero
          </span>
          <span className="text-xs sm:text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400 block">
            ${ccl.toLocaleString('es-AR')}
          </span>
          <span className="text-[9px] font-mono text-emerald-500">
            +{brechaCclPercent.toFixed(1)}%
          </span>
        </div>

        <div className="p-2.5 bg-surface-container-low dark:bg-[#131822] rounded-xl border border-surface-container-high dark:border-[#1E2638] text-center space-y-0.5">
          <span className="text-[10px] font-sans uppercase font-bold text-slate-500 dark:text-slate-400 block truncate">
            Dólar Blue
          </span>
          <span className="text-xs sm:text-sm font-mono font-extrabold text-cyan-600 dark:text-cyan-400 block">
            ${blue.toLocaleString('es-AR')}
          </span>
          <span className="text-[9px] font-mono text-cyan-500">
            +{brechaBluePercent.toFixed(1)}%
          </span>
        </div>
      </div>
    </Card>
  );
};
