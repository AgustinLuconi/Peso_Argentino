import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'emerald' | 'cyan' | 'outline' | 'ghost' | 'danger';
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
    'inline-flex items-center justify-center font-sans font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg sm:rounded-xl active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold hover:bg-slate-800 dark:hover:bg-emerald-400 border border-transparent shadow-sm hover:shadow-emerald-glow hover:-translate-y-0.5',
    secondary:
      'bg-surface-container dark:bg-[#131822] text-on-surface dark:text-slate-200 hover:bg-surface-container-high dark:hover:bg-[#1B2230] border border-surface-container-highest dark:border-[#1E2638] hover:-translate-y-0.5',
    emerald:
      'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 border border-emerald-600/30 shadow-sm hover:shadow-emerald-glow hover:-translate-y-0.5',
    gold:
      'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 border border-emerald-600/30 shadow-sm hover:shadow-emerald-glow hover:-translate-y-0.5',
    cyan:
      'bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 border border-cyan-600/30 shadow-sm hover:shadow-cyan-glow hover:-translate-y-0.5',
    outline:
      'bg-transparent border border-surface-container-highest dark:border-[#1E2638] hover:border-emerald-500 hover:text-emerald-500 text-on-surface-variant dark:text-slate-300 hover:bg-emerald-500/5 hover:-translate-y-0.5',
    ghost:
      'bg-transparent hover:bg-surface-container-low dark:hover:bg-white/5 text-on-surface-variant dark:text-slate-300 hover:text-emerald-500',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 border border-rose-900/20 hover:-translate-y-0.5 shadow-sm',
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
