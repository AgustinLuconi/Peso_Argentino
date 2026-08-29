import React from 'react';
import { clsx } from 'clsx';

export interface StatBoxProps {
  icon?: React.ReactNode;
  label: string;
  primaryValue: string | React.ReactNode;
  secondaryValue?: string | React.ReactNode;
  footnote?: string | React.ReactNode;
  accent?: 'emerald' | 'cyan' | 'rose' | 'slate';
  className?: string;
  onClick?: () => void;
}

/**
 * Componente Global y Único para podios y tarjetas pequeñas de estadísticas/destacados.
 */
export const StatBox: React.FC<StatBoxProps> = ({
  icon,
  label,
  primaryValue,
  secondaryValue,
  footnote,
  accent = 'emerald',
  className,
  onClick,
}) => {
  const accentIconStyles = {
    emerald: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    cyan: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
    rose: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    slate: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'app-stat-pod',
        onClick && 'cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5',
        className
      )}
    >
      {icon && (
        <div className={clsx('p-2.5 rounded-xl shrink-0', accentIconStyles[accent])}>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1 overflow-hidden">
        <span className="text-xs font-sans text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block truncate mb-1">
          {label}
        </span>
        <div className="flex items-baseline gap-2 flex-wrap min-w-0">
          <span className="text-base sm:text-lg lg:text-xl font-bold font-sans text-slate-900 dark:text-slate-100 truncate block">
            {primaryValue}
          </span>
          {secondaryValue && (
            <span className="text-xs sm:text-sm lg:text-base font-bold font-sans text-emerald-600 dark:text-emerald-400 truncate block">
              {secondaryValue}
            </span>
          )}
        </div>
        {footnote && (
          <span className="text-[11px] font-sans text-on-surface-variant dark:text-slate-400 block truncate mt-0.5">
            {footnote}
          </span>
        )}
      </div>
    </div>
  );
};
