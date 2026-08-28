/**
 * Utilidades de exportación y copiado rápido de datos tabulares financieros.
 * Formato CSV compatible con Excel en español (separador ';' o coma configurable)
 * y formateo numérico tabular.
 */

export interface ExportColumn<T> {
  header: string;
  accessor: (item: T) => string | number | null | undefined;
}

export const exportToCsv = <T>(
  filename: string,
  columns: ExportColumn<T>[],
  data: T[]
): void => {
  if (!data || data.length === 0) return;

  const headerRow = columns.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(';');
  const dataRows = data.map((item) =>
    columns
      .map((col) => {
        const val = col.accessor(item);
        if (val === null || val === undefined) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(';')
  );

  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const copyTableToClipboard = async <T>(
  columns: ExportColumn<T>[],
  data: T[]
): Promise<boolean> => {
  if (!data || data.length === 0) return false;

  const headerText = columns.map((c) => c.header).join('\t');
  const rowsText = data
    .map((item) =>
      columns
        .map((col) => {
          const val = col.accessor(item);
          return val === null || val === undefined ? '' : String(val);
        })
        .join('\t')
    )
    .join('\n');

  const fullText = `${headerText}\n${rowsText}`;
  try {
    await navigator.clipboard.writeText(fullText);
    return true;
  } catch (err) {
    console.error('Error al copiar datos:', err);
    return false;
  }
};
