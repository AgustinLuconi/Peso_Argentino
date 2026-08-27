import React, { useState, useMemo } from 'react';
import { MarketAsset } from '../domain/MarketAsset';
import { Table, Column } from '@core/ui/components/Table';
import { TrendIndicator } from '@core/ui/components/TrendIndicator';
import { Badge } from '@core/ui/components/Badge';
import { Button } from '@core/ui/components/Button';
import { ArrowUpDown, ArrowUp, ArrowDown, BarChart2, Search } from 'lucide-react';

export interface MarketAssetTableProps {
  assets: MarketAsset[];
  onSelectAsset?: (asset: MarketAsset) => void;
  onOpenAnalysis?: (ticker: string) => void;
  showBondMetrics?: boolean;
  showForeignBondMetrics?: boolean;
}

type SortField = 'ticker' | 'lastPrice' | 'variation24h' | 'tir' | 'paridad' | 'rsi14';
type SortOrder = 'asc' | 'desc';

export const MarketAssetTable: React.FC<MarketAssetTableProps> = ({
  assets,
  onSelectAsset,
  onOpenAnalysis,
  showBondMetrics = false,
  showForeignBondMetrics = false,
}) => {
  const [sortField, setSortField] = useState<SortField>('variation24h');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAssets = useMemo(() => {
    if (!searchQuery.trim()) return assets;
    const q = searchQuery.toLowerCase().trim();
    return assets.filter(
      (a) => a.ticker.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
    );
  }, [assets, searchQuery]);

  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
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
        case 'tir':
          valA = a.tir?.value ?? 0;
          valB = b.tir?.value ?? 0;
          break;
        case 'paridad':
          valA = a.paridad?.value ?? 0;
          valB = b.paridad?.value ?? 0;
          break;
        case 'rsi14':
          valA = a.rsi14 ?? 50;
          valB = b.rsi14 ?? 50;
          break;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [filteredAssets, sortField, sortOrder]);

  const columns: Column<MarketAsset>[] = [
    {
      header: 'Especie / Ticker',
      accessor: (asset) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-sans font-bold text-xs sm:text-sm text-primary">
              {asset.ticker}
            </span>
            {asset.legislation && (
              <Badge variant={asset.legislation === 'NEW_YORK' ? 'navy' : 'neutral'} size="sm" className="text-[9px]">
                {asset.legislation === 'NEW_YORK' ? 'Ley NY' : asset.legislation === 'ARGENTINA' ? 'Ley Arg' : 'Global'}
              </Badge>
            )}
          </div>
          <span className="text-[11px] font-sans text-on-surface-variant truncate max-w-[220px]">
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
    ...(showBondMetrics
      ? [
          {
            header: 'TIR / Rendimiento',
            accessor: (asset: MarketAsset) => (
              <span className="font-mono-tabular font-bold text-xs sm:text-sm text-secondary">
                {asset.tir ? `${asset.tir.value}%` : asset.tna ? `${asset.tna}% TNA` : '-'}
              </span>
            ),
            align: 'right' as const,
            width: '14%',
          },
          {
            header: 'Paridad / Duration',
            accessor: (asset: MarketAsset) => (
              <div className="flex flex-col items-end">
                {asset.paridad ? (
                  <Badge variant="gold" size="sm">
                    {asset.paridad.value}% Paridad
                  </Badge>
                ) : asset.tem ? (
                  <span className="text-xs font-mono font-semibold text-gold">
                    {asset.tem}% TEM
                  </span>
                ) : (
                  <span className="text-xs text-on-surface-variant">-</span>
                )}
                {asset.modifiedDurationYears && (
                  <span className="text-[10px] text-on-surface-variant">
                    Dur: {asset.modifiedDurationYears}a
                  </span>
                )}
              </div>
            ),
            align: 'right' as const,
            width: '14%',
          },
        ]
      : [
          {
            header: 'RSI (14 Ruedas)',
            accessor: (asset: MarketAsset) => {
              const rsi = asset.rsi14 ?? 50;
              return (
                <div className="flex flex-col items-end">
                  <span
                    className={`font-mono text-xs font-bold ${
                      rsi >= 70
                        ? 'text-bearish-red'
                        : rsi <= 30
                        ? 'text-bullish-green'
                        : 'text-primary'
                    }`}
                  >
                    {rsi}
                  </span>
                  <span className="text-[9px] text-on-surface-variant">
                    {rsi >= 70 ? 'Sobrecompra' : rsi <= 30 ? 'Sobrevendido' : 'Neutral'}
                  </span>
                </div>
              );
            },
            align: 'right' as const,
            width: '14%',
          },
          {
            header: 'Rango 52 Semanas',
            accessor: (asset: MarketAsset) => {
              if (!asset.fiftyTwoWeekHigh || !asset.fiftyTwoWeekLow) {
                return <span className="text-xs text-on-surface-variant">-</span>;
              }
              const progress = Math.min(
                100,
                Math.max(
                  10,
                  ((asset.lastPrice.amount - asset.fiftyTwoWeekLow) /
                    (asset.fiftyTwoWeekHigh - asset.fiftyTwoWeekLow)) *
                    100
                )
              );
              return (
                <div className="w-24 ml-auto flex flex-col items-end gap-1">
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gold h-full rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[9px] font-mono text-on-surface-variant">
                    Min ${asset.fiftyTwoWeekLow.toFixed(0)} - Max ${asset.fiftyTwoWeekHigh.toFixed(0)}
                  </span>
                </div>
              );
            },
            align: 'right' as const,
            width: '14%',
          },
        ]),
    {
      header: 'Acciones',
      accessor: (asset) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenAnalysis) {
                onOpenAnalysis(asset.ticker);
              }
            }}
            icon={<BarChart2 size={13} className="text-primary hover:text-gold" />}
            title="Ver Análisis Cuantitativo & Fundamental"
            className="px-2 py-1 h-7 text-[11px]"
          >
            Análisis
          </Button>
        </div>
      ),
      align: 'right',
      width: '12%',
    },
  ];

  return (
    <div className="space-y-3">
      {/* Search & Quick Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-sans text-on-surface-variant px-1 pb-1">
        {/* Search input */}
        <div className="relative max-w-xs w-full">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por ticker o nombre..."
            className="w-full pl-8 pr-3 py-1.5 bg-surface-container-low border border-surface-container-highest rounded-xl text-xs font-sans text-on-surface placeholder:text-outline focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Sort Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="font-eyebrow text-outline shrink-0">Ordenar:</span>
          <button
            onClick={() => handleSort('variation24h')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono-tabular font-semibold border shrink-0 transition-all ${
              sortField === 'variation24h'
                ? 'bg-primary text-white border-primary shadow-soft'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high border-surface-container-highest'
            }`}
          >
            Mayor Var 24h {sortField === 'variation24h' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSort('lastPrice')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono-tabular font-semibold border shrink-0 transition-all ${
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
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono-tabular font-semibold border shrink-0 transition-all ${
                sortField === 'tir'
                  ? 'bg-primary text-white border-primary shadow-soft'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high border-surface-container-highest'
              }`}
            >
              Mayor TIR {sortField === 'tir' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          )}
        </div>
      </div>

      <Table
        columns={columns}
        data={sortedAssets}
        keyExtractor={(item) => item.ticker}
        onRowClick={(item) => {
          if (onOpenAnalysis) {
            onOpenAnalysis(item.ticker);
          } else if (onSelectAsset) {
            onSelectAsset(item);
          }
        }}
      />
    </div>
  );
};
