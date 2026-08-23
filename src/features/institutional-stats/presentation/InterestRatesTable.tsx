import React from 'react';
import { InterestRateMetric } from '../domain/InterestRateMetric';
import { Table, Column } from '@core/ui/components/Table';
import { Badge } from '@core/ui/components/Badge';
import { Percent } from 'lucide-react';

export const InterestRatesTable: React.FC<{ rates: InterestRateMetric[] }> = ({
  rates,
}) => {
  const columns: Column<InterestRateMetric>[] = [
    {
      header: 'Tasa / Instrumento',
      accessor: (item) => (
        <div className="flex flex-col">
          <span className="font-sans font-bold text-xs text-primary">{item.name}</span>
          <span className="text-[11px] font-sans text-on-surface-variant truncate max-w-sm">
            {item.description}
          </span>
        </div>
      ),
      width: '40%',
    },
    {
      header: 'Tipo',
      accessor: (item) => {
        const typeLabels = {
          policy: { text: 'POLÍTICA MONETARIA', variant: 'navy' as const },
          deposits: { text: 'DEPÓSITOS', variant: 'neutral' as const },
          interbank: { text: 'INTERBANCARIA', variant: 'gold' as const },
          market: { text: 'MERCADO / BYMA', variant: 'bullish' as const },
        };
        const config = typeLabels[item.type];
        return <Badge variant={config.variant} size="sm">{config.text}</Badge>;
      },
      width: '18%',
    },
    {
      header: 'TNA Anual',
      accessor: (item) => (
        <span className="font-mono-tabular font-bold text-xs text-primary">
          {item.tna.format({ showSign: false })}
        </span>
      ),
      align: 'right',
      width: '14%',
    },
    {
      header: 'TEA Efectiva',
      accessor: (item) => (
        <span className="font-mono-tabular font-bold text-xs text-secondary">
          {item.tea.format({ showSign: false })}
        </span>
      ),
      align: 'right',
      width: '14%',
    },
    {
      header: 'TEM Mensual',
      accessor: (item) => (
        <span className="font-mono-tabular text-xs text-on-surface">
          {item.tem.format({ showSign: false })}
        </span>
      ),
      align: 'right',
      width: '14%',
    },
  ];

  return (
    <div className="space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container-highest pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary text-gold rounded-xl shrink-0 shadow-sm">
            <Percent size={18} />
          </div>
          <div>
            <h2 className="font-h2 text-base sm:text-lg">
              Estructura de Tasas de Interés del Sistema Financiero
            </h2>
            <p className="font-subtitle text-xs">
              Tasas del mercado monetario, depósitos a plazo y política del Tesoro
            </p>
          </div>
        </div>
        <span className="font-mono-tabular text-xs text-outline self-end sm:self-auto">
          TNA / TEA / TEM
        </span>
      </div>

      <Table
        columns={columns}
        data={rates}
        keyExtractor={(r) => r.id}
      />
    </div>
  );
};
