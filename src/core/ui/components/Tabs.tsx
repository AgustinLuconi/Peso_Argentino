import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'institutional';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'institutional',
  className,
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none',
          variant === 'institutional' &&
            'p-1 bg-surface-container-low border border-surface-container-high rounded-xl',
          variant === 'underline' && 'border-b border-outline-variant/40 gap-6',
          className
        )
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        if (variant === 'institutional') {
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'px-3.5 py-1.5 text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-200 rounded-lg inline-flex items-center gap-2 shrink-0',
                isActive
                  ? 'bg-primary text-white shadow-sm border border-primary/20 scale-[1.02]'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/80'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    'px-2 py-0.5 text-[10px] font-mono rounded-full',
                    isActive ? 'bg-gold text-primary font-bold' : 'bg-surface-container text-on-surface-variant'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        }

        if (variant === 'underline') {
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'pb-2.5 pt-1 text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-200 relative inline-flex items-center gap-2 shrink-0',
                isActive
                  ? 'text-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full'
                  : 'text-outline hover:text-on-surface'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] font-mono px-2 py-0.5 bg-surface-container rounded-full text-on-surface-variant">
                  {tab.count}
                </span>
              )}
            </button>
          );
        }

        // pills variant
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'px-3.5 py-1.5 text-xs font-sans rounded-full transition-all duration-200 shrink-0 inline-flex items-center gap-1.5',
              isActive
                ? 'bg-gold text-primary font-bold shadow-sm scale-[1.02]'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
