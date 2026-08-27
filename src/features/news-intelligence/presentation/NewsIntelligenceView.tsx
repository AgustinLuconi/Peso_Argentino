import React, { useEffect, useState } from 'react';
import { NewsCard } from './NewsCard';
import { ExecutiveBriefCard } from './ExecutiveBriefCard';
import { GetImpactNewsUseCase } from '../application/GetImpactNewsUseCase';
import { BackendNewsRepository } from '../infrastructure/BackendNewsRepository';
import { NewsIntelligenceDto } from '../application/NewsRepositoryPort';
import { Button } from '@core/ui/components/Button';
import { smartCache } from '@core/infrastructure/SmartCacheAdapter';
import { RefreshCw, Filter } from 'lucide-react';

export const NewsIntelligenceView: React.FC<{
  activeSubItem?: string | null;
}> = ({ activeSubItem }) => {
  const [data, setData] = useState<NewsIntelligenceDto | null>(null);
  const [filterImpact, setFilterImpact] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (activeSubItem) {
      if (activeSubItem === 'brief') {
        document.getElementById('news-brief-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (activeSubItem === 'critical') {
        setFilterImpact('critico');
        document.getElementById('news-critical-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [activeSubItem]);

  const repo = new BackendNewsRepository();
  const useCase = new GetImpactNewsUseCase(repo);

  const fetchNews = async (forceRefresh: boolean = false) => {
    if (forceRefresh) {
      setRefreshing(true);
      smartCache.invalidate('news_intelligence_backend_all_all');
    } else {
      setLoading(true);
    }

    const result = await useCase.execute();
    setData(result);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-primary" size={28} />
          <span className="font-eyebrow">
            Sintetizando cables de noticias desde el backend...
          </span>
        </div>
      </div>
    );
  }

  const filteredNews = data.newsList.filter((item) => {
    if (filterImpact === 'all') return true;
    return item.impactLevel === filterImpact;
  });

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header Banner */}
      <div className="bg-white border border-surface-container-highest p-5 sm:p-6 rounded-2xl shadow-tactile stroke-of-value card-interactive flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-h1 mb-1">
            Intelligence Feed & Noticias Financieras
          </h1>
          <p className="font-subtitle max-w-3xl">
            Monitoreo en tiempo real de noticias con impacto macroeconómico directo sobre la deuda soberana, el tipo de cambio y los mercados.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNews(true)}
            icon={<RefreshCw size={14} className={refreshing ? 'animate-spin text-primary' : ''} />}
          >
            {refreshing ? 'Actualizando...' : 'Actualizar Noticias'}
          </Button>
        </div>
      </div>

      {/* Executive AI Briefing */}
      <div id="news-brief-section">
        <ExecutiveBriefCard topAssets={data.topAffectedAssets} />
      </div>

      {/* News Feed with Impact Filters */}
      <div id="news-critical-section" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-surface-container-highest shadow-soft">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gold" />
            <h2 className="font-h3 text-xs sm:text-sm">
              Cables de Impacto Recientes ({filteredNews.length})
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-eyebrow text-[10px] mr-1">Filtrar:</span>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'critico', label: 'Crítico (Mercado)' },
              { id: 'alto', label: 'Alto Impacto' },
              { id: 'moderado', label: 'Moderado' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterImpact(f.id)}
                className={`px-3 py-1 text-xs font-sans font-semibold rounded-full transition-all duration-200 ${
                  filterImpact === f.id
                    ? 'bg-primary text-white shadow-sm scale-105'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container border border-surface-container-highest'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNews.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
