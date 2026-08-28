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
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-sans text-outline dark:text-slate-400 uppercase font-semibold block truncate">
          {label}
        </span>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-base font-bold font-sans text-slate-900 dark:text-slate-100">
            {primaryValue}
          </span>
          {secondaryValue && (
            <span className="text-sm font-bold font-sans text-emerald-600 dark:text-emerald-400">
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
