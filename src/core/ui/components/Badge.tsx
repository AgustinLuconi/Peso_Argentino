import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'bullish' | 'bearish' | 'neutral' | 'navy' | 'outline' | 'warning' | 'emerald' | 'cyan';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-sans font-bold uppercase tracking-wider rounded-full select-none transition-colors whitespace-nowrap leading-none text-center';

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-[10px] gap-1',
    md: 'px-3 py-1.5 text-[11px] gap-1.5',
  };

  const variantStyles = {
    emerald: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs',
    gold: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs',
    cyan: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-xs',
    bullish: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs',
    bearish: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-xs',
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs',
    neutral: 'bg-surface-container text-on-surface-variant border border-surface-container-highest dark:bg-[#131822] dark:text-slate-300 dark:border-[#1E2638]',
    navy: 'bg-slate-900 dark:bg-[#131822] text-emerald-400 border border-emerald-500/30 shadow-xs',
    outline: 'bg-transparent text-on-surface border border-surface-container-highest dark:border-[#1E2638] dark:text-slate-200',
  };

  return (
    <span
      className={twMerge(
        clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)
      )}
      {...props}
    >
      {children}
    </span>
  );
};
