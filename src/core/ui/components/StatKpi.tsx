import React from 'react';
import { TrendIndicator } from './TrendIndicator';
import { MiniSparkline } from './MiniSparkline';
import { Card } from './Card';
import { clsx } from 'clsx';

export interface StatKpiProps {
  label: string;
  value: string;
  change?: number;
  changePeriod?: string;
  sparklineData?: number[];
  footerText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'navy' | 'elevated';
  accent?: 'gold' | 'navy' | 'none';
}

export const StatKpi: React.FC<StatKpiProps> = ({
  label,
  value,
  change,
  changePeriod = '24h',
  sparklineData,
  footerText,
  icon,
  variant = 'default',
  accent = 'none',
}) => {
  const isNavy = variant === 'navy';

  return (
    <Card
      variant={variant}
      accent={accent}
      className={clsx(
        'flex flex-col justify-between rounded-2xl p-4 sm:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-soft',
        isNavy ? 'text-white' : 'text-on-surface'
      )}
    >
      {/* Top row: Label and Icon */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={clsx(
            'font-eyebrow block truncate',
            isNavy ? 'text-slate-300' : 'text-outline'
          )}
        >
          {label}
        </span>
        {icon && (
          <span
            className={clsx(
              'p-2 rounded-xl shrink-0 transition-transform group-hover:scale-110 shadow-soft',
              isNavy ? 'bg-primary-container text-gold' : 'bg-surface-container text-primary'
            )}
          >
            {icon}
          </span>
        )}
      </div>

      {/* Middle row: Big Value */}
      <div className="my-1">
        <span
          className={clsx(
            'text-xl sm:text-2xl 2xl:text-3xl font-mono-tabular font-extrabold tracking-tight block',
            isNavy ? 'text-white' : 'text-primary'
          )}
        >
          {value}
        </span>
      </div>

      {/* Bottom row: Variation & Sparkline */}
      <div className="mt-2.5 pt-2.5 border-t border-surface-container-highest/60 flex items-center justify-between gap-2 text-xs">
        {change !== undefined ? (
          <div className="flex items-center gap-1.5">
            <TrendIndicator value={change} size="sm" />
            <span
              className={clsx(
                'text-[10px] font-sans',
                isNavy ? 'text-slate-300' : 'text-outline'
              )}
            >
              {changePeriod}
            </span>
          </div>
        ) : footerText ? (
          <span
            className={clsx(
              'text-[10px] font-sans truncate',
              isNavy ? 'text-slate-300' : 'text-on-surface-variant'
            )}
          >
            {footerText}
          </span>
        ) : null}

        {sparklineData && (
          <div className="w-16 h-5 shrink-0">
            <MiniSparkline
              data={sparklineData}
              height={18}
              color={isNavy ? 'gold' : 'auto'}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
