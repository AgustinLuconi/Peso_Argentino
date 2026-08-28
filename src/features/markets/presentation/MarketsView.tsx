import React, { useEffect, useState, useRef } from 'react';
import { MervalIndicesHeader } from './MervalIndicesHeader';
import { AdrsWallStreetCard } from './AdrsWallStreetCard';
import { MarketAssetTable } from './MarketAssetTable';
import { AssetAnalysisModal } from './AssetAnalysisModal';
import { LecapsCurveView } from './LecapsCurveView';
import { SovereignBondsCurveView } from './SovereignBondsCurveView';
import { CerBondsCurveView } from './CerBondsCurveView';
import { GetMarketAssetsUseCase } from '../application/GetMarketAssetsUseCase';
import { BackendMarketRepository } from '../infrastructure/BackendMarketRepository';
import { MarketAssetsDto } from '../application/MarketRepositoryPort';
import { Tabs } from '@core/ui/components/Tabs';
import { Card } from '@core/ui/components/Card';
import { Button } from '@core/ui/components/Button';
import { smartCache } from '@core/infrastructure/SmartCacheAdapter';
import { RefreshCw, BarChart2 } from 'lucide-react';

export const MarketsView: React.FC<{
  onSelectBondDetail?: (ticker: string) => void;
  activeSubItem?: string | null;
}> = ({ onSelectBondDetail, activeSubItem }) => {
  const [data, setData] = useState<MarketAssetsDto | null>(null);
  const [activeTab, setActiveTab] = useState('panel-lider');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAnalysisTicker, setSelectedAnalysisTicker] = useState<string | null>(null);
  const explorerRef = useRef<HTMLDivElement>(null);

  const repo = new BackendMarketRepository();
  const useCase = new GetMarketAssetsUseCase(repo);

  const fetchMarkets = async (forceRefresh: boolean = false) => {
    if (forceRefresh) {
      setRefreshing(true);
      smartCache.invalidate('markets_data_backend_all');
    } else if (!data) {
      setLoading(true);
    }

    try {
      const result = await useCase.execute();
      if (result) {
        setData(result);
      }
    } catch (err) {
      console.error('[MarketsView] Error fetching markets data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  // Handle deep-linking from sub-menu
  useEffect(() => {
    if (activeSubItem) {
      if (
        activeSubItem === 'panel-lider' ||
        activeSubItem === 'panel-general' ||
        activeSubItem === 'adrs' ||
        activeSubItem === 'cedears' ||
        activeSubItem === 'bonos-usd' ||
        activeSubItem === 'bonos-pesos' ||
        activeSubItem === 'curva-lecaps' ||
        activeSubItem === 'bonos-extranjeros' ||
        activeSubItem === 'commodities' ||
        activeSubItem === 'cripto-divisas'
      ) {
        setActiveTab(activeSubItem);
        setTimeout(() => {
          explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else if (activeSubItem === 'lecaps') {
        setActiveTab('curva-lecaps');
        setTimeout(() => {
          explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else if (activeSubItem === 'merval') {
        setActiveTab('panel-lider');
        setTimeout(() => {
          explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else if (activeSubItem === 'bonds') {
        setActiveTab('bonos-usd');
        setTimeout(() => {
          explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [activeSubItem]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-primary" size={28} />
          <span className="font-eyebrow">
            Cargando cotizaciones y análisis en vivo del mercado de capitales...
          </span>
        </div>
      </div>
    );
  }

  // Filtrado por categorías de mercado
  const panelLider = data.assets.filter((a) => a.category === 'panel-lider');
  const panelGeneral = data.assets.filter((a) => a.category === 'panel-general');
  const adrs = data.assets.filter((a) => a.category === 'adrs');
  const cedears = data.assets.filter((a) => a.category === 'cedears');
  const bondsUsd = data.assets.filter((a) => a.category === 'bonos-usd');
  const bondsPesos = data.assets.filter((a) => a.category === 'bonos-pesos');
  const bondsForeign = data.assets.filter((a) => a.category === 'bonos-extranjeros');
  const commodities = data.assets.filter((a) => a.category === 'commodities');
  const criptoDivisas = data.assets.filter((a) => a.category === 'cripto-divisas');

  const tabList = [
    { id: 'panel-lider', label: '🏛️ Panel Líder BYMA', count: panelLider.length },
    { id: 'panel-general', label: '🏢 Panel General Secundario', count: panelGeneral.length },
    { id: 'curva-lecaps', label: '📊 Curva de Lecaps & Boncaps' },
    { id: 'adrs', label: '🗽 ADRs Wall Street (USD)', count: adrs.length },
    { id: 'cedears', label: '🌐 CEDEARs BYMA', count: cedears.length },
    { id: 'bonos-usd', label: '💵 Bonos Soberanos USD', count: bondsUsd.length },
    { id: 'bonos-pesos', label: '📈 Bonos Pesos & CER', count: bondsPesos.length },
    { id: 'bonos-extranjeros', label: '🌎 Bonos Extranjeros & Treasuries', count: bondsForeign.length },
    { id: 'commodities', label: '🌾 Commodities Agro & Energía', count: commodities.length },
    { id: 'cripto-divisas', label: '⚡ Cripto & Divisas', count: criptoDivisas.length },
  ];

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Top Banner */}
      <div className="bg-white border border-surface-container-highest p-5 sm:p-6 rounded-2xl shadow-tactile stroke-of-value card-interactive flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-h1 mb-1">
              Mercado de Capitales & Renta Fija Integral
            </h1>
          </div>
          <p className="font-subtitle max-w-3xl">
            Monitoreo institucional en tiempo real de Bolsas y Mercados Argentinos (BYMA), Panel General, Curva de Lecaps, ADRs en Wall Street, CEDEARs, Curvas de Bonos Soberanos Locales y Extranjeros, y Commodities del Agro.
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
      <div ref={explorerRef} id="markets-explorer-section">
        <Card variant="default" accent="gold" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-h2 flex items-center gap-2">
                <BarChart2 size={18} className="text-gold" />
                Explorador Integral de Cotizaciones & Renta Fija
              </h2>
              <p className="font-subtitle text-xs">
                Selecciona una categoría para explorar cotizaciones, rendimientos, indicadores técnicos y análisis fundamental
              </p>
            </div>
          </div>

          <Tabs
            tabs={tabList}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="pt-2">
            {activeTab === 'curva-lecaps' && (
              <LecapsCurveView />
            )}

            {activeTab === 'panel-lider' && (
              <MarketAssetTable
                assets={panelLider}
                onOpenAnalysis={(ticker) => setSelectedAnalysisTicker(ticker)}
              />
            )}

            {activeTab === 'panel-general' && (
              <MarketAssetTable
                assets={panelGeneral}
                onOpenAnalysis={(ticker) => setSelectedAnalysisTicker(ticker)}
              />
            )}

            {activeTab === 'adrs' && (
              <MarketAssetTable
                assets={adrs}
                onOpenAnalysis={(ticker) => setSelectedAnalysisTicker(ticker)}
              />
            )}

            {activeTab === 'cedears' && (
              <MarketAssetTable
                assets={cedears}
                onOpenAnalysis={(ticker) => setSelectedAnalysisTicker(ticker)}
              />
            )}

            {activeTab === 'bonos-usd' && (
              <SovereignBondsCurveView onSelectBondDetail={onSelectBondDetail} />
            )}

            {activeTab === 'bonos-pesos' && (
              <CerBondsCurveView />
            )}

            {activeTab === 'bonos-extranjeros' && (
              <MarketAssetTable
                assets={bondsForeign}
                showBondMetrics={true}
                showForeignBondMetrics={true}
                onOpenAnalysis={(ticker) => setSelectedAnalysisTicker(ticker)}
              />
            )}

            {activeTab === 'commodities' && (
              <MarketAssetTable
                assets={commodities}
                onOpenAnalysis={(ticker) => setSelectedAnalysisTicker(ticker)}
              />
            )}

            {activeTab === 'cripto-divisas' && (
              <MarketAssetTable
                assets={criptoDivisas}
                onOpenAnalysis={(ticker) => setSelectedAnalysisTicker(ticker)}
              />
            )}
          </div>
        </Card>
      </div>

      {/* Asset Analysis Modal */}
      <AssetAnalysisModal
        ticker={selectedAnalysisTicker}
        onClose={() => setSelectedAnalysisTicker(null)}
      />
    </div>
  );
};
