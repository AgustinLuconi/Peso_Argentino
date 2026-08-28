import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'navy' | 'flat';
  accent?: 'gold' | 'navy' | 'none';
  children: React.ReactNode;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  accent = 'none',
  children,
  className,
  interactive = true,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 relative overflow-hidden',
          interactive && 'card-interactive',
          variant === 'default' &&
            'bg-white border border-surface-container-highest shadow-soft',
          variant === 'elevated' &&
            'bg-white border border-surface-container-high shadow-tactile',
          variant === 'outline' &&
            'bg-surface-container-low border border-surface-container-highest',
          variant === 'navy' &&
            'bg-slate-900 dark:bg-[#0F141C] text-white border border-slate-800 dark:border-[#1E2638] shadow-tactile',
          variant === 'flat' &&
            'bg-surface-container-low border-0',
          accent === 'gold' && 'border-emerald-500/40 dark:border-emerald-500/30',
          accent === 'navy' && 'border-cyan-500/40 dark:border-cyan-500/30',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
