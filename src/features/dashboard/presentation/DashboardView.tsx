import React, { useEffect, useState } from 'react';
import { DollarQuotesCard } from './DollarQuotesCard';
import { MacroKpiGrid } from './MacroKpiGrid';
import { BreachHistoryChart } from './BreachHistoryChart';
import { ExecutiveSummaryCard } from './ExecutiveSummaryCard';
import { GetDashboardMetricsUseCase } from '../application/GetDashboardMetricsUseCase';
import { DolarApiQuoteRepository } from '../infrastructure/DolarApiQuoteRepository';
import { DashboardMetricsDto } from '../application/DashboardRepositoryPort';
import { MarketQuote } from '../domain/MarketQuote';
import { Modal } from '@core/ui/components/Modal';
import { TrendIndicator } from '@core/ui/components/TrendIndicator';
import { Button } from '@core/ui/components/Button';
import { smartCache } from '@core/infrastructure/SmartCacheAdapter';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export const DashboardView: React.FC<{
  onNavigateToBondDetail?: () => void;
  onNavigateToMarkets?: () => void;
}> = ({ onNavigateToBondDetail, onNavigateToMarkets }) => {
  const [data, setData] = useState<DashboardMetricsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<MarketQuote | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('');

  const repo = new DolarApiQuoteRepository();
  const useCase = new GetDashboardMetricsUseCase(repo);

  const fetchMetrics = async (forceRefresh: boolean = false) => {
    if (forceRefresh) {
      setRefreshing(true);
      smartCache.invalidate('dolar_api_dashboard_metrics');
    } else {
      setLoading(true);
    }

    const result = await useCase.execute();
    setData(result);
    setLastRefreshedAt(
      new Date().toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMetrics();

    // Auto-refresh dollar quotes every 30 seconds
    const interval = setInterval(() => {
      fetchMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-primary" size={28} />
          <span className="font-eyebrow">
            Sincronizando cotizaciones con DolarApi y BCRA...
          </span>
        </div>
      </div>
    );
  }

  const cacheStats = smartCache.getStats();

  return (
    <div className="space-y-5 sm:space-y-6 animate-page-enter">
      {/* Top Banner / Hero Info */}
      <div className="bg-white dark:bg-[#081124] border border-surface-container-highest dark:border-[#1a2744] p-5 sm:p-6 rounded-2xl shadow-tactile stroke-of-value flex flex-col md:flex-row md:items-center justify-between gap-4 card-interactive">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-h1">
              Monitor Macroeconómico de la República Argentina
            </h1>
          </div>
          <p className="font-subtitle max-w-4xl">
            Indicadores monetarios oficiales, cotizaciones en tiempo real del mercado cambiario (DolarApi), reservas internacionales del BCRA y brecha cambiaria.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-start md:self-center shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMetrics(true)}
            icon={<RefreshCw size={14} className={refreshing ? 'animate-spin text-primary' : ''} />}
          >
            {refreshing ? 'Actualizando...' : 'Refrescar Datos'}
          </Button>

          {onNavigateToMarkets && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToMarkets}
            >
              Ver Mercados BYMA
            </Button>
          )}

          {onNavigateToBondDetail && (
            <Button
              variant="gold"
              size="sm"
              onClick={onNavigateToBondDetail}
            >
              Calcular AL30 / TIR
            </Button>
          )}
        </div>
      </div>

      {/* Primary Dollar Quotes Section */}
      <DollarQuotesCard
        quotes={data.quotes}
        onSelectQuote={(quote) => setSelectedQuote(quote)}
      />

      {/* Main Macro KPIs Grid */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="font-h2">
            Variables Monetarias & Deuda Soberana
          </h2>
          <div className="flex items-center gap-3 text-xs font-sans text-outline">
            <span className="flex items-center gap-1 text-bullish-green font-medium">
              <CheckCircle2 size={13} />
              Caché Activo ({cacheStats.hitRatio.toFixed(0)}% Hits)
            </span>
            <span className="font-mono-tabular font-normal">
              Actualizado: {lastRefreshedAt || data.lastUpdated}
            </span>
          </div>
        </div>
        <MacroKpiGrid kpis={data.kpis} />
      </div>

      {/* Breach Chart & Executive Pillars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-12 gap-5 sm:gap-6">
        <div className="3xl:col-span-7">
          <BreachHistoryChart timeSeries={data.breachHistory} />
        </div>
        <div className="3xl:col-span-5">
          <ExecutiveSummaryCard />
        </div>
      </div>

      {/* Modal for Dollar Quote Details */}
      {selectedQuote && (
        <Modal
          isOpen={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          title={`Detalle Técnico: ${selectedQuote.name}`}
          subtitle="Información institucional y operativa del tipo de cambio"
        >
          <div className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-surface-container-low dark:bg-[#0c1730] border border-surface-container dark:border-[#1a2744] rounded-2xl">
                <span className="font-eyebrow block mb-1">Precio Compra</span>
                <span className="text-xl font-mono-tabular font-bold text-primary">
                  {selectedQuote.buyPrice.format()}
                </span>
              </div>
              <div className="p-3.5 bg-surface-container-low dark:bg-[#0c1730] border border-surface-container dark:border-[#1a2744] rounded-2xl">
                <span className="font-eyebrow block mb-1">Precio Venta</span>
                <span className="text-xl font-mono-tabular font-bold text-primary">
                  {selectedQuote.sellPrice.format()}
                </span>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#081124] border border-surface-container-highest dark:border-[#1a2744] rounded-2xl space-y-2.5 shadow-soft">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant font-medium">Variación 24hs:</span>
                <TrendIndicator value={selectedQuote.variation24h.value} size="md" />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant font-medium">Spread de Cotización:</span>
                <span className="font-mono-tabular">
                  {selectedQuote.spread.format()} ({selectedQuote.spreadPercent.format()})
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant font-medium">Mercado / Liquidador:</span>
                <span className="font-semibold text-primary">
                  {selectedQuote.type === 'oficial' || selectedQuote.type === 'mayorista'
                    ? 'Banco Central de la Rep. Arg. (MULC)'
                    : selectedQuote.type === 'mep' || selectedQuote.type === 'ccl'
                    ? 'Bolsas y Mercados Argentinos (BYMA)'
                    : selectedQuote.type === 'cripto'
                    ? 'P2P / Exchanges Cripto (USDT)'
                    : 'Mercado Informal Libre'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setSelectedQuote(null)}>
                Cerrar Ficha
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
