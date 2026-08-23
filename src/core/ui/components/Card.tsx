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
            'bg-primary text-white border border-primary-container shadow-tactile',
          variant === 'flat' &&
            'bg-surface-container-low border-0',
          accent === 'gold' && 'stroke-of-value',
          accent === 'navy' && 'stroke-of-value-navy',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
