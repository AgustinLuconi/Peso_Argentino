import React from 'react';
import { Badge } from './Badge';

export interface PageHeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeVariant?: 'gold' | 'bullish' | 'bearish' | 'neutral' | 'navy' | 'outline' | 'warning' | 'emerald' | 'cyan';
  actions?: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * Componente Global y Único para todos los encabezados / banners de módulos.
 * Modificando este componente se actualiza automáticamente el estilo de todas las vistas.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badgeText,
  badgeVariant = 'emerald',
  actions,
  icon,
}) => {
  return (
    <div className="app-header-banner">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          {icon && (
            <span className="p-2 bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 rounded-xl shrink-0">
              {icon}
            </span>
          )}
          <h1 className="font-h1 text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          {badgeText && (
            <Badge variant={badgeVariant} size="sm">
              {badgeText}
            </Badge>
          )}
        </div>
        <p className="font-subtitle text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
