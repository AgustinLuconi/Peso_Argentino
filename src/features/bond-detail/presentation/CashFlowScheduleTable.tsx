import React from 'react';
import { CashFlowItem } from '../domain/BondDetail';
import { Table, Column } from '@core/ui/components/Table';
import { Badge } from '@core/ui/components/Badge';
import { CheckCircle2, Clock, CalendarDays } from 'lucide-react';

export const CashFlowScheduleTable: React.FC<{ cashFlows: CashFlowItem[] }> = ({
  cashFlows,
}) => {
  const columns: Column<CashFlowItem>[] = [
    {
      header: 'Fecha de Pago',
      accessor: (item) => (
        <div className="flex items-center gap-2">
          {item.status === 'paid' ? (
            <CheckCircle2 size={14} className="text-bullish-green" />
          ) : item.status === 'upcoming' ? (
            <Clock size={14} className="text-gold" />
          ) : (
            <CalendarDays size={14} className="text-outline" />
          )}
          <span className="font-mono-tabular font-bold text-xs text-primary">
            {item.paymentDate}
          </span>
        </div>
      ),
      width: '20%',
    },
    {
      header: 'Estado',
      accessor: (item) => {
        if (item.status === 'paid') {
          return <Badge variant="bullish" size="sm">PAGADO</Badge>;
        }
        if (item.status === 'upcoming') {
          return <Badge variant="gold" size="sm">PRÓXIMO</Badge>;
        }
        return <Badge variant="neutral" size="sm">FUTURO</Badge>;
      },
      width: '15%',
    },
    {
      header: 'Amortización (V.N. %)',
      accessor: (item) => (
        <span className="font-mono-tabular text-xs text-on-surface">
          {item.amortizationPercent > 0 ? `${item.amortizationPercent.toFixed(1)}%` : '-'}
        </span>
      ),
      align: 'right',
      width: '18%',
    },
    {
      header: 'Renta / Cupón',
      accessor: (item) => (
        <span className="font-mono-tabular text-xs text-on-surface">
          US$ {item.interestAmountUsd.toFixed(3)}
        </span>
      ),
      align: 'right',
      width: '15%',
    },
    {
      header: 'Flujo Total (x100 V.N.)',
      accessor: (item) => (
        <span className="font-mono-tabular font-bold text-xs text-primary">
          US$ {item.totalCashFlowUsd.toFixed(3)}
        </span>
      ),
      align: 'right',
      width: '18%',
    },
    {
      header: 'Residual %',
      accessor: (item) => (
        <span className="font-mono-tabular text-xs text-outline">
          {item.remainingCapitalPercent.toFixed(1)}%
        </span>
      ),
      align: 'right',
      width: '14%',
    },
  ];

  return (
    <div className="space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container-highest pb-3">
        <h3 className="font-h3 text-base text-primary">
          Cronograma de Pagos & Flujo de Fondos (Amortización + Renta)
        </h3>
        <span className="font-subtitle text-xs text-on-surface-variant">
          Valores calculados por cada 100 V.N.
        </span>
      </div>

      <Table
        columns={columns}
        data={cashFlows}
        keyExtractor={(item) => item.paymentDate}
      />
    </div>
  );
};
