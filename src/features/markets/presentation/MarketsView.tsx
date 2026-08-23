import React, { useEffect, useState } from 'react';
import { MervalIndicesHeader } from './MervalIndicesHeader';
import { AdrsWallStreetCard } from './AdrsWallStreetCard';
import { MarketAssetTable } from './MarketAssetTable';
import { GetMarketAssetsUseCase } from '../application/GetMarketAssetsUseCase';
import { BackendMarketRepository } from '../infrastructure/BackendMarketRepository';
import { MarketAssetsDto } from '../application/MarketRepositoryPort';
import { Tabs } from '@core/ui/components/Tabs';
import { Card } from '@core/ui/components/Card';
import { Button } from '@core/ui/components/Button';
import { smartCache } from '@core/infrastructure/SmartCacheAdapter';
import { RefreshCw } from 'lucide-react';

export const MarketsView: React.FC<{
  onSelectBondDetail?: (ticker: string) => void;
}> = ({ onSelectBondDetail }) => {
  const [data, setData] = useState<MarketAssetsDto | null>(null);
  const [activeTab, setActiveTab] = useState('panel-lider');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const repo = new BackendMarketRepository();
  const useCase = new GetMarketAssetsUseCase(repo);

  const fetchMarkets = async (forceRefresh: boolean = false) => {
    if (forceRefresh) {
      setRefreshing(true);
      smartCache.invalidate('markets_data_backend_all');
    } else {
      setLoading(true);
    }

    const result = await useCase.execute();
    setData(result);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-primary" size={28} />
          <span className="font-eyebrow">
            Cargando cotizaciones del servidor backend...
          </span>
        </div>
      </div>
    );
  }

  const panelLider = data.assets.filter((a) => a.category === 'merval');
  const adrs = data.assets.filter((a) => a.category === 'adrs');
  const bondsUsd = data.assets.filter((a) => a.category === 'bonds');
  const lecaps = data.assets.filter((a) => a.category === 'lecaps');

  const tabList = [
    {
      id: 'panel-lider',
      label: 'Acciones Panel Líder',
      count: panelLider.length,
    },
    {
      id: 'adrs',
      label: 'ADRs Wall Street (USD)',
      count: adrs.length,
    },
    {
      id: 'bonos',
      label: 'Renta Fija Soberana (USD)',
      count: bondsUsd.length,
    },
    {
      id: 'lecaps',
      label: 'Lecaps & Letras ARS',
      count: lecaps.length,
    },
  ];

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Top Banner */}
      <div className="bg-white border border-surface-container-highest p-5 sm:p-6 rounded-2xl shadow-tactile stroke-of-value card-interactive flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-h1 mb-1">
            Mercado de Capitales & Renta Variable
          </h1>
          <p className="font-subtitle max-w-3xl">
            Monitoreo en tiempo real de Bolsas y Mercados Argentinos (BYMA), ADRs en Wall Street (NYSE/NASDAQ) y curvas de deuda soberana.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMarkets(true)}
            icon={<RefreshCw size={14} className={refreshing ? 'animate-spin text-primary' : ''} />}
          >
            {refreshing ? 'Actualizando...' : 'Actualizar Mercado'}
          </Button>
        </div>
      </div>

      {/* Merval Big Indices Header Cards */}
      <MervalIndicesHeader indices={data.indices} />

      {/* Wall Street ADRs Quick View Card */}
      <AdrsWallStreetCard adrs={adrs} />

      {/* Main Asset Explorer Tabs */}
      <Card variant="default" accent="gold" className="space-y-4">
        <div>
          <h2 className="font-h2">
            Panel de Cotizaciones & Renta Fija
          </h2>
          <p className="font-subtitle text-xs">
            Selecciona una categoría para explorar precios, variaciones y métricas cuantitativas
          </p>
        </div>

        <Tabs
          tabs={tabList}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="pt-2">
          {activeTab === 'panel-lider' && (
            <MarketAssetTable
              assets={panelLider}
              onSelectAsset={(asset) => console.log('Selected:', asset.ticker)}
            />
          )}

          {activeTab === 'adrs' && (
            <MarketAssetTable
              assets={adrs}
              onSelectAsset={(asset) => console.log('Selected ADR:', asset.ticker)}
            />
          )}

          {activeTab === 'bonos' && (
            <MarketAssetTable
              assets={bondsUsd}
              showBondMetrics={true}
              onSelectAsset={(asset) => {
                if (onSelectBondDetail) {
                  onSelectBondDetail(asset.ticker);
                }
              }}
            />
          )}

          {activeTab === 'lecaps' && (
            <MarketAssetTable
              assets={lecaps}
              showBondMetrics={true}
              onSelectAsset={(asset) => console.log('Selected Lecap:', asset.ticker)}
            />
          )}
        </div>
      </Card>
    </div>
  );
};
