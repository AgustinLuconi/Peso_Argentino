import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TrendIndicatorProps {
  value: number; // e.g. 2.45 or -1.20
  suffix?: string;
  prefix?: string;
  decimals?: number;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  suffix = '%',
  prefix = '',
  decimals = 2,
  showIcon = true,
  className,
  size = 'md',
}) => {
  const isPositive = value > 0.0001;
  const isNegative = value < -0.0001;
  const isNeutral = !isPositive && !isNegative;

  const colorClass = isPositive
    ? 'text-bullish-green bg-teal-50 dark:bg-teal-950/50 border-teal-200/50 dark:border-teal-800'
    : isNegative
    ? 'text-bearish-red bg-red-50 dark:bg-red-950/50 border-red-200/50 dark:border-red-800'
    : 'text-on-surface-variant bg-surface-container border-outline-variant/30';

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
    lg: 'text-sm px-3 py-1 gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const sign = isPositive ? '+' : isNegative ? '-' : '';
  const formattedVal = Math.abs(value).toLocaleString('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center font-mono-tabular font-bold rounded-lg border select-none transition-all shadow-2xs',
          colorClass,
          sizeClasses[size],
          className
        )
      )}
    >
      {showIcon && (
        <>
          {isPositive && <TrendingUp size={iconSizes[size]} className="shrink-0 stroke-[2.2]" />}
          {isNegative && <TrendingDown size={iconSizes[size]} className="shrink-0 stroke-[2.2]" />}
          {isNeutral && <Minus size={iconSizes[size]} className="shrink-0" />}
        </>
      )}
      <span>
        {prefix}
        {sign}
        {formattedVal}
        {suffix}
      </span>
    </span>
  );
};
