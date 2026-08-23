import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'bullish' | 'bearish' | 'neutral' | 'navy' | 'outline' | 'warning';
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
    'inline-flex items-center font-sans font-bold uppercase tracking-wider rounded-full select-none transition-colors';

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[9px] gap-1',
    md: 'px-2.5 py-1 text-[10px] gap-1.5',
  };

  const variantStyles = {
    gold: 'bg-champagne-light/70 text-secondary border border-gold/40 shadow-xs',
    bullish: 'bg-teal-50 text-bullish-green border border-teal-200/60 shadow-xs',
    bearish: 'bg-red-50 text-bearish-red border border-red-200/60 shadow-xs',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/60 shadow-xs',
    neutral: 'bg-surface-container text-on-surface-variant border border-surface-container-highest',
    navy: 'bg-primary text-gold border border-gold/30 shadow-xs',
    outline: 'bg-transparent text-on-surface border border-surface-container-highest',
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
