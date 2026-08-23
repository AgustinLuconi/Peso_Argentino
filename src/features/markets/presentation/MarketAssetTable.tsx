import React, { useState, useMemo } from 'react';
import { MarketAsset } from '../domain/MarketAsset';
import { Table, Column } from '@core/ui/components/Table';
import { TrendIndicator } from '@core/ui/components/TrendIndicator';
import { MiniSparkline } from '@core/ui/components/MiniSparkline';
import { Badge } from '@core/ui/components/Badge';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface MarketAssetTableProps {
  assets: MarketAsset[];
  onSelectAsset?: (asset: MarketAsset) => void;
  showBondMetrics?: boolean;
}

type SortField = 'ticker' | 'lastPrice' | 'variation24h' | 'variationMonth' | 'variationYear' | 'tir' | 'paridad';
type SortOrder = 'asc' | 'desc';

export const MarketAssetTable: React.FC<MarketAssetTableProps> = ({
  assets,
  onSelectAsset,
  showBondMetrics = false,
}) => {
  const [sortField, setSortField] = useState<SortField>('variation24h');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedAssets = useMemo(() => {
    return [...assets].sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      switch (sortField) {
        case 'ticker':
          valA = a.ticker;
          valB = b.ticker;
          break;
        case 'lastPrice':
          valA = a.lastPrice.amount;
          valB = b.lastPrice.amount;
          break;
        case 'variation24h':
          valA = a.variation24h.value;
          valB = b.variation24h.value;
          break;
        case 'variationMonth':
          valA = a.variationMonth.value;
          valB = b.variationMonth.value;
          break;
        case 'variationYear':
          valA = a.variationYear.value;
          valB = b.variationYear.value;
          break;
        case 'tir':
          valA = a.tir?.value ?? 0;
          valB = b.tir?.value ?? 0;
          break;
        case 'paridad':
          valA = a.paridad?.value ?? 0;
          valB = b.paridad?.value ?? 0;
          break;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [assets, sortField, sortOrder]);

  const renderSortHeader = (title: string, field: SortField, align: 'left' | 'right' = 'left') => {
    const isActive = sortField === field;
    return (
      <div
        onClick={() => handleSort(field)}
        className={`flex items-center gap-1 cursor-pointer select-none hover:text-primary transition-colors ${
          align === 'right' ? 'justify-end' : 'justify-start'
        } ${isActive ? 'text-primary font-bold' : ''}`}
      >
        <span>{title}</span>
        {isActive ? (
          sortOrder === 'asc' ? (
            <ArrowUp size={12} className="text-gold" />
          ) : (
            <ArrowDown size={12} className="text-gold" />
          )
        ) : (
          <ArrowUpDown size={11} className="text-outline opacity-50" />
        )}
      </div>
    );
  };

  const columns: Column<MarketAsset>[] = [
    {
      header: 'Especie / Ticker',
      accessor: (asset) => (
        <div className="flex flex-col">
          <span className="font-sans font-bold text-xs sm:text-sm text-primary">
            {asset.ticker}
          </span>
          <span className="text-[11px] font-sans text-on-surface-variant truncate max-w-[200px]">
            {asset.name}
          </span>
        </div>
      ),
      width: '24%',
    },
    {
      header: 'Último Precio',
      accessor: (asset) => (
        <span className="font-mono-tabular font-bold text-xs sm:text-sm text-primary">
          {asset.lastPrice.format()}
        </span>
      ),
      align: 'right',
      width: '14%',
    },
    {
      header: 'Var. 24h',
      accessor: (asset) => (
        <TrendIndicator value={asset.variation24h.value} size="sm" />
      ),
      align: 'right',
      width: '12%',
    },
    {
      header: 'Var. Mensual',
      accessor: (asset) => (
        <TrendIndicator value={asset.variationMonth.value} size="sm" />
      ),
      align: 'right',
      width: '12%',
    },
    ...(showBondMetrics
      ? [
          {
            header: 'TIR (%)',
            accessor: (asset: MarketAsset) => (
              <span className="font-mono-tabular font-bold text-xs sm:text-sm text-secondary">
                {asset.tir ? asset.tir.format({ showSign: false }) : '-'}
              </span>
            ),
            align: 'right' as const,
            width: '10%',
          },
          {
            header: 'Paridad',
            accessor: (asset: MarketAsset) => (
              <Badge variant="gold" size="sm">
                {asset.paridad ? asset.paridad.format({ showSign: false }) : '-'}
              </Badge>
            ),
            align: 'right' as const,
            width: '10%',
          },
        ]
      : [
          {
            header: 'Var. Anual (YTD)',
            accessor: (asset: MarketAsset) => (
              <TrendIndicator value={asset.variationYear.value} size="sm" />
            ),
            align: 'right' as const,
            width: '12%',
          },
        ]),
    {
      header: 'Tendencia Reciente',
      accessor: (asset) => (
        <div className="w-20 ml-auto">
          <MiniSparkline data={asset.sparkline} height={20} color="auto" />
        </div>
      ),
      align: 'right',
      width: '16%',
    },
  ];

  return (
    <div className="space-y-2.5">
      {/* Quick Sort Bar */}
      <div className="flex items-center justify-between text-xs font-sans text-on-surface-variant px-1 pb-1">
        <div className="flex items-center gap-2">
          <span className="font-eyebrow text-outline">Ordenar por:</span>
          <button
            onClick={() => handleSort('variation24h')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono-tabular font-semibold border transition-all ${
              sortField === 'variation24h'
                ? 'bg-primary text-white border-primary shadow-soft'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high border-surface-container-highest'
            }`}
          >
            Mayor Var 24h {sortField === 'variation24h' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSort('lastPrice')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono-tabular font-semibold border transition-all ${
              sortField === 'lastPrice'
                ? 'bg-primary text-white border-primary shadow-soft'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high border-surface-container-highest'
            }`}
          >
            Precio {sortField === 'lastPrice' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          {showBondMetrics && (
            <button
              onClick={() => handleSort('tir')}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono-tabular font-semibold border transition-all ${
                sortField === 'tir'
                  ? 'bg-primary text-white border-primary shadow-soft'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high border-surface-container-highest'
              }`}
            >
              Mayor TIR {sortField === 'tir' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          )}
        </div>

        <span className="font-mono text-[10px] text-outline">
          {sortedAssets.length} activos listados
        </span>
      </div>

      <Table
        columns={columns}
        data={sortedAssets}
        keyExtractor={(item) => item.ticker}
        onRowClick={onSelectAsset}
      />
    </div>
  );
};
