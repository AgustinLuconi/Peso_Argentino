import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-sans font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg sm:rounded-xl active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-primary text-white hover:bg-primary-container border border-primary/20 shadow-sm hover:shadow-md hover:-translate-y-0.5',
    secondary:
      'bg-surface-container text-on-surface hover:bg-surface-container-high border border-surface-container-highest hover:-translate-y-0.5',
    gold:
      'bg-gold text-primary font-bold hover:bg-[#d4b06a] border border-gold-dark/20 shadow-sm hover:shadow-gold-glow hover:-translate-y-0.5',
    outline:
      'bg-transparent border border-surface-container-highest hover:border-gold hover:text-primary text-on-surface-variant hover:bg-surface-container-low hover:-translate-y-0.5',
    ghost:
      'bg-transparent hover:bg-surface-container-low text-on-surface-variant hover:text-primary',
    danger:
      'bg-bearish-red text-white hover:bg-red-800 border border-red-900/20 hover:-translate-y-0.5',
  };

  return (
    <button
      className={twMerge(
        clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
