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
  const [filterRegion, setFilterRegion] = useState<string>('all');
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
          <RefreshCw className="animate-spin text-primary dark:text-gold" size={28} />
          <span className="font-eyebrow text-on-surface">
            Sintetizando edición diaria de noticias locales y globales...
          </span>
        </div>
      </div>
    );
  }

  const allNewsCombined = data.breakingNews ? [data.breakingNews, ...data.newsList] : data.newsList;

  const filteredNews = allNewsCombined.filter((item) => {
    const matchesImpact = filterImpact === 'all' || item.impactLevel === filterImpact;
    let matchesRegion = true;
    if (filterRegion === 'nacional') {
      matchesRegion = item.scope === 'nacional';
    } else if (filterRegion === 'usa') {
      matchesRegion = item.region?.includes('Estados Unidos') || item.source.includes('Fed') || item.source.includes('WSJ');
    } else if (filterRegion === 'global') {
      matchesRegion = item.scope === 'internacional' && !item.region?.includes('Estados Unidos');
    }
    return matchesImpact && matchesRegion;
  });

  const countNacionales = allNewsCombined.filter((n) => n.scope === 'nacional').length;
  const countUSA = allNewsCombined.filter((n) => n.region?.includes('Estados Unidos') || n.source.includes('Fed') || n.source.includes('WSJ')).length;
  const countGlobal = allNewsCombined.filter((n) => n.scope === 'internacional' && !n.region?.includes('Estados Unidos')).length;

  const todayFormatted = new Date().toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#071228] border border-surface-container-highest dark:border-[#1a2744] p-5 sm:p-6 rounded-2xl shadow-tactile stroke-of-value card-interactive flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold bg-primary/10 dark:bg-gold/15 text-primary dark:text-gold border border-primary/20 dark:border-gold/30 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              EDICIÓN DEL DÍA: {todayFormatted.toUpperCase()}
            </span>
            <span className="text-[11px] font-sans text-on-surface-variant dark:text-slate-400">
              • Rotación automática a medianoche
            </span>
          </div>
          <h1 className="font-h1 mb-1 text-primary dark:text-slate-100">
            Intelligence Feed & Noticias Financieras
          </h1>
          <p className="font-subtitle max-w-3xl text-on-surface-variant dark:text-slate-300">
            Monitoreo en tiempo real de variables locales (BCRA, inflación, tasas) y globales de Estados Unidos (Tasas Fed, S&P 500, Petróleo WTI, Soja) que impactan directamente sobre bonos y acciones argentinas.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNews(true)}
            icon={<RefreshCw size={14} className={refreshing ? 'animate-spin text-primary dark:text-gold' : ''} />}
          >
            {refreshing ? 'Actualizando...' : 'Actualizar Noticias'}
          </Button>
        </div>
      </div>

      {/* Executive AI Briefing */}
      <div id="news-brief-section">
        <ExecutiveBriefCard topAssets={data.topAffectedAssets} />
      </div>

      {/* News Feed with Scope & Impact Filters */}
      <div id="news-critical-section" className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-[#071228] p-3.5 rounded-2xl border border-surface-container-highest dark:border-[#1a2744] shadow-soft">
          {/* Scope Selector Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: `Todas (${allNewsCombined.length})` },
              { id: 'nacional', label: `🇦🇷 Locales / BCRA (${countNacionales})` },
              { id: 'usa', label: `🇺🇸 Estados Unidos & Fed (${countUSA})` },
              { id: 'global', label: `🌐 Global & Commodities (${countGlobal})` },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setFilterRegion(s.id)}
                className={`px-3 py-1.5 text-xs font-sans font-bold rounded-xl transition-all duration-200 ${
                  filterRegion === s.id
                    ? 'bg-gold text-slate-950 shadow-md font-extrabold scale-105'
                    : 'bg-surface-container-low dark:bg-[#0c1936] text-on-surface hover:bg-surface-container border border-surface-container-highest dark:border-[#1a2744]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Impact Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-eyebrow text-[10px] mr-1 text-on-surface-variant dark:text-slate-400">Impacto:</span>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'critico', label: 'Crítico' },
              { id: 'alto', label: 'Alto' },
              { id: 'moderado', label: 'Moderado' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterImpact(f.id)}
                className={`px-2.5 py-1 text-xs font-sans font-semibold rounded-full transition-all duration-200 ${
                  filterImpact === f.id
                    ? 'bg-primary dark:bg-slate-200 text-white dark:text-slate-950 shadow-xs'
                    : 'bg-surface-container-low dark:bg-[#0c1936] text-on-surface hover:bg-surface-container border border-surface-container-highest dark:border-[#1a2744]'
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
