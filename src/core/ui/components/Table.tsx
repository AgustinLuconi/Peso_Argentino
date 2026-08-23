import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface Column<T> {
  header: string | React.ReactNode;
  accessor: (item: T) => React.ReactNode;
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
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  className,
  dense = false,
}: TableProps<T>) {
  return (
    <div
      className={twMerge(
        'w-full overflow-x-auto rounded-2xl border border-surface-container-highest dark:border-[#1a2744] bg-white dark:bg-[#081124] shadow-soft',
        className
      )}
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low dark:bg-[#0c1730] border-b border-surface-container-highest dark:border-[#1a2744]">
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{ width: col.width }}
                className={clsx(
                  'font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-outline select-none first:rounded-tl-2xl last:rounded-tr-2xl',
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
        <tbody className="divide-y divide-surface-container-high dark:divide-[#1a2744] font-sans text-xs">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-outline font-sans text-xs"
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
                    ? 'cursor-pointer hover:bg-surface-container-low/80 dark:hover:bg-[#101e3d] hover:translate-x-0.5'
                    : 'hover:bg-surface-container-lowest dark:hover:bg-[#0c1730]',
                  rowIdx === data.length - 1 && 'first:rounded-bl-2xl last:rounded-br-2xl'
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
  );
}
