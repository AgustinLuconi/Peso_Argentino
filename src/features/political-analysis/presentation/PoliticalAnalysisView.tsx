import React, { useEffect, useState } from 'react';
import { GovernanceRadarCard } from './GovernanceRadarCard';
import { LegislativeTrackerTable } from './LegislativeTrackerTable';
import { RigiAndReformPillars } from './RigiAndReformPillars';
import { GetPoliticalAnalysisUseCase } from '../application/GetPoliticalAnalysisUseCase';
import { BackendPoliticalRepository } from '../infrastructure/BackendPoliticalRepository';
import { PoliticalAnalysisDto } from '../application/PoliticalRepositoryPort';
import { Button } from '@core/ui/components/Button';
import { PageHeader } from '@core/ui/components/PageHeader';
import { smartCache } from '@core/infrastructure/SmartCacheAdapter';
import { RefreshCw } from 'lucide-react';

export const PoliticalAnalysisView: React.FC<{
  activeSubItem?: string | null;
}> = ({ activeSubItem }) => {
  const [data, setData] = useState<PoliticalAnalysisDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (activeSubItem) {
      if (activeSubItem === 'radar') {
        document.getElementById('radar-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (activeSubItem === 'rigi') {
        document.getElementById('rigi-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (activeSubItem === 'laws') {
        document.getElementById('laws-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [activeSubItem]);

  const repo = new BackendPoliticalRepository();
  const useCase = new GetPoliticalAnalysisUseCase(repo);

  const fetchPoliticalData = async (forceRefresh: boolean = false) => {
    if (forceRefresh) {
      setRefreshing(true);
      smartCache.invalidate('political_analysis_backend');
    } else if (!data) {
      setLoading(true);
    }

    try {
      const result = await useCase.execute();
      if (result) {
        setData(result);
      }
    } catch (err) {
      console.error('[PoliticalAnalysisView] Error fetching political data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPoliticalData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-primary" size={28} />
          <span className="font-eyebrow">
            Evaluando radar político y monitor legislativo desde el backend...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-page-enter">
      <PageHeader
        title="Análisis Político, Regulatorio & Gobernabilidad"
        subtitle="Monitoreo de riesgo institucional, seguimiento de reformas estructurales en el Congreso de la Nación y pipeline de inversiones RIGI."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchPoliticalData(true)}
            icon={<RefreshCw size={14} className={refreshing ? 'animate-spin text-primary' : ''} />}
          >
            {refreshing ? 'Actualizando...' : 'Actualizar Leyes & RIGI'}
          </Button>
        }
      />

      {/* Governance & Political Risk Radar */}
      <div id="radar-section">
        <GovernanceRadarCard riskIndex={data.riskIndex} />
      </div>

      {/* RIGI Pipeline & Structural Reform Pillars */}
      <div id="rigi-section">
        <RigiAndReformPillars
          rigiSummary={data.rigiSummary}
          executiveBriefing={data.executiveBriefing}
        />
      </div>

      {/* Legislative & DNU Tracker */}
      <div id="laws-section">
        <LegislativeTrackerTable items={data.legislativeItems} />
      </div>
    </div>
  );
};
