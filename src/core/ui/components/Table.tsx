import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Download, Copy, Check } from 'lucide-react';
import { exportToCsv, copyTableToClipboard, ExportColumn } from '@core/utils/exportUtils';

export interface Column<T> {
  header: string | React.ReactNode;
  accessor: (item: T) => React.ReactNode;
  rawAccessor?: (item: T) => string | number | null | undefined;
  align?: 'left' | 'center' | 'right';
  className?: string;
  width?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  onRowClick?: (item: T) => void;
  className?: string;
  dense?: boolean;
  title?: string;
  exportable?: boolean | string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  className,
  dense = false,
  title,
  exportable = false,
}: TableProps<T>) {
  const [copied, setCopied] = useState(false);

  const exportCols: ExportColumn<T>[] = columns.map((col) => ({
    header: typeof col.header === 'string' ? col.header : 'Columna',
    accessor: (item: T) => {
      if (col.rawAccessor) return col.rawAccessor(item);
      const val = col.accessor(item);
      if (typeof val === 'string' || typeof val === 'number') return val;
      return '';
    },
  }));

  const handleExportCsv = () => {
    const filename = typeof exportable === 'string' ? exportable : title || 'tabla_financiera';
    exportToCsv(filename, exportCols, data);
  };

  const handleCopy = async () => {
    const success = await copyTableToClipboard(exportCols, data);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={twMerge(
        'w-full rounded-2xl border border-surface-container-highest dark:border-[#1E2638] bg-white dark:bg-[#0F141C] shadow-soft overflow-hidden',
        className
      )}
    >
      {/* Optional Table Header with Title and Export Actions */}
      {(title || exportable) && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-surface-container-low dark:bg-[#131822] border-b border-surface-container-highest dark:border-[#1E2638]">
          {title ? (
            <h3 className="font-h3 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
          ) : (
            <div />
          )}

          {exportable && data.length > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                title="Copiar datos al portapapeles"
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-sans font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 bg-white dark:bg-[#0F141C] border border-slate-200 dark:border-[#1E2638] hover:border-emerald-500/50 rounded-lg transition-colors shadow-xs"
              >
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>

              <button
                onClick={handleExportCsv}
                title="Descargar tabla en formato CSV (Excel)"
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-sans font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/30 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors shadow-xs"
              >
                <Download size={12} />
                <span>CSV</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low dark:bg-[#131822] border-b border-surface-container-highest dark:border-[#1E2638]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{ width: col.width }}
                  className={clsx(
                    'font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-outline dark:text-slate-300 select-none',
                    dense ? 'py-2 px-3' : 'py-3 px-4',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high dark:divide-[#1E2638] font-sans text-xs text-slate-900 dark:text-slate-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-outline dark:text-slate-400 font-sans text-xs"
                >
                  No se encontraron registros disponibles.
                </td>
              </tr>
            ) : (
              data.map((item, rowIdx) => (
                <tr
                  key={keyExtractor(item, rowIdx)}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={clsx(
                    'transition-all duration-150',
                    onRowClick
                      ? 'cursor-pointer hover:bg-surface-container-low/80 dark:hover:bg-[#161B26] hover:translate-x-0.5'
                      : 'hover:bg-surface-container-lowest dark:hover:bg-[#131822]'
                  )}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={clsx(
                        dense ? 'py-2 px-3' : 'py-3 px-4',
                        col.align === 'right' && 'text-right font-mono-tabular',
                        col.align === 'center' && 'text-center',
                        col.className
                      )}
                    >
                      {col.accessor(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
