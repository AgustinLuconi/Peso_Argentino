import React, { useEffect, useState } from 'react';
import { BcraBalanceCard } from './BcraBalanceCard';
import { InterestRatesTable } from './InterestRatesTable';
import { MacroSeriesComparator } from './MacroSeriesComparator';
import { TradeBalanceCard } from './TradeBalanceCard';
import { CarryTradeSimulator } from './CarryTradeSimulator';
import { GetInstitutionalStatsUseCase } from '../application/GetInstitutionalStatsUseCase';
import { BackendInstitutionalStatsRepository } from '../infrastructure/BackendInstitutionalStatsRepository';
import { InstitutionalStatsDto } from '../application/InstitutionalStatsRepositoryPort';
import { Button } from '@core/ui/components/Button';
import { PageHeader } from '@core/ui/components/PageHeader';
import { smartCache } from '@core/infrastructure/SmartCacheAdapter';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export const InstitutionalStatsView: React.FC<{
  activeSubItem?: string | null;
}> = ({ activeSubItem }) => {
  const [data, setData] = useState<InstitutionalStatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (activeSubItem) {
      if (activeSubItem === 'balance') {
        document.getElementById('balance-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (activeSubItem === 'series') {
        document.getElementById('series-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (activeSubItem === 'carry') {
        document.getElementById('carry-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (activeSubItem === 'rates') {
        document.getElementById('rates-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [activeSubItem]);

  const repo = new BackendInstitutionalStatsRepository();
  const useCase = new GetInstitutionalStatsUseCase(repo);

  const fetchStats = async (forceRefresh: boolean = false) => {
    if (forceRefresh) {
      setRefreshing(true);
      smartCache.invalidate('institutional_stats_backend');
    } else if (!data) {
      setLoading(true);
    }

    try {
      const result = await useCase.execute();
      if (result) {
        setData(result);
      }
    } catch (err) {
      console.error('[InstitutionalStatsView] Error fetching institutional stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-primary" size={28} />
          <span className="font-eyebrow">
            Cargando estadísticas oficiales del BCRA, INDEC, Argly y ArgentinaDatos...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header Banner */}
      <PageHeader
        title="Estadísticas Institucionales & Banco Central"
        subtitle="Monitor oficial de agregados monetarios, saneamiento del balance del BCRA, curvas de tasas bancarias en tiempo real y series históricas del INDEC."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchStats(true)}
            icon={<RefreshCw size={14} className={refreshing ? 'animate-spin text-primary' : ''} />}
          >
            {refreshing ? 'Actualizando...' : 'Actualizar Tasas & Series'}
          </Button>
        }
      />

      {/* BCRA Balance Consolidated Sheet */}
      <div id="balance-section">
        <BcraBalanceCard balance={data.balanceSheet} />
      </div>

      {/* Macro Comparative Historical Series */}
      <div id="series-section">
        <MacroSeriesComparator series={data.series} />
      </div>

      {/* Real Rate vs Inflation Simulator */}
      <div id="carry-section">
        <CarryTradeSimulator />
      </div>

      {/* Interest Rates & Trade Balance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div id="rates-section" className="lg:col-span-2 bg-white p-5 rounded-2xl border border-surface-container-highest shadow-tactile">
          <InterestRatesTable rates={data.rates} />
        </div>
        <div className="lg:col-span-1">
          <TradeBalanceCard tradeSummary={data.tradeBalanceSummary} />
        </div>
      </div>
    </div>
  );
};
