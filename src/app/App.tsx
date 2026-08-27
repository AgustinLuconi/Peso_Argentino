import React, { useEffect, useState } from 'react';
import { MainLayout } from '@core/ui/layout/MainLayout';
import { useApp } from './providers/AppContext';
import { DashboardView } from '@features/dashboard/presentation/DashboardView';
import { MarketsView } from '@features/markets/presentation/MarketsView';
import { LecapsCurveView } from '@features/markets/presentation/LecapsCurveView';
import { BondDetailView } from '@features/bond-detail/presentation/BondDetailView';
import { InstitutionalStatsView } from '@features/institutional-stats/presentation/InstitutionalStatsView';
import { PoliticalAnalysisView } from '@features/political-analysis/presentation/PoliticalAnalysisView';
import { NewsIntelligenceView } from '@features/news-intelligence/presentation/NewsIntelligenceView';
import { QuickCurrencyConverter } from '@core/ui/components/QuickCurrencyConverter';
import { FinancialAiModal } from '@core/ui/components/FinancialAiModal';
import { Modal } from '@core/ui/components/Modal';
import { Search, ArrowRight, TrendingUp, Landmark, Calculator, Scale, Newspaper, ArrowRightLeft, Bot } from 'lucide-react';

export const App: React.FC = () => {
  const {
    activeFeature,
    setActiveFeature,
    activeSubItem,
    setActiveSubItem,
    navigateTo,
    selectedBondTicker,
    setSelectedBondTicker,
    isRefreshing,
    refreshAllData,
    isSearchOpen,
    setIsSearchOpen,
    isConverterOpen,
    setIsConverterOpen,
    isAiModalOpen,
    setIsAiModalOpen,
  } = useApp();

  const [searchFilter, setSearchFilter] = useState('');

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  const featureTitles: Record<string, string> = {
    dashboard: 'Dashboard Principal & Cotizaciones Dólar',
    markets: 'Mercado de Capitales, Merval & Renta Fija',
    'lecaps-curve': 'Curva de Rendimientos Lecaps & Boncaps del Tesoro',
    'bond-detail': `Ficha Técnica & Renta Fija (${selectedBondTicker})`,
    'institutional-stats': 'Estadísticas BCRA & Series Macro',
    'political-analysis': 'Análisis Político & Regulatorio',
    'news-intelligence': 'Intelligence Feed & Noticias Financieras',
  };

  const quickNavItems = [
    { title: 'Curva de Rendimientos Lecaps & Boncaps ARS', feature: 'lecaps-curve', icon: <TrendingUp size={16} className="text-gold" />, keywords: 'lecap lecaps boncaps letras tasa fija tem tna tea curva rendimiento' },
    { title: 'Copiloto Financiero IA (100% Gratis)', feature: 'ai-copilot', icon: <Bot size={16} className="text-gold" />, keywords: 'ia asistente copilot inteligencia artificial gemini chat preguntas' },
    { title: 'Cotizaciones Dólar (Oficial, Blue, MEP, CCL)', feature: 'dashboard', subItem: 'quotes', icon: <TrendingUp size={16} />, keywords: 'dolar mep blue ccl oficial tarjeta cripto cotizacion' },
    { title: 'Conversor Rápido de Divisas & Brecha', feature: 'converter', icon: <ArrowRightLeft size={16} />, keywords: 'conversor convertir pesos dolares calculador' },
    { title: 'Panel Líder Merval & Panel General BYMA', feature: 'markets', subItem: 'panel-lider', icon: <TrendingUp size={16} />, keywords: 'merval acciones ggal ypf pamp bma adrs nyse general' },
    { title: 'Calculadora de Rendimiento & Flujo AL30 / GD30', feature: 'bond-detail', subItem: 'calc', icon: <Calculator size={16} />, keywords: 'bonos al30 gd30 renta fija tir paridad cupones' },
    { title: 'Balance General BCRA & Tasas de Interés', feature: 'institutional-stats', subItem: 'balance', icon: <Landmark size={16} />, keywords: 'bcra reservas base monetaria lefi pases indec inflacion tasas' },
    { title: 'Radar de Gobernabilidad & Proyectos RIGI', feature: 'political-analysis', subItem: 'radar', icon: <Scale size={16} />, keywords: 'politica leyes dnu rigi congreso gobernabilidad reformas' },
    { title: 'Feed de Noticias de Alto Impacto Macroeconómico', feature: 'news-intelligence', subItem: 'critical', icon: <Newspaper size={16} />, keywords: 'noticias intelligence feed comunicados finanzas' },
  ];

  const filteredNavItems = quickNavItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.keywords.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <MainLayout
      activeFeature={activeFeature}
      activeSubItem={activeSubItem}
      onSelectFeature={(feature, sub) => navigateTo(feature, sub)}
      onRefreshData={refreshAllData}
      isRefreshing={isRefreshing}
      activeFeatureTitle={featureTitles[activeFeature]}
      onSearchClick={() => setIsSearchOpen(true)}
    >
      {/* Route Switcher */}
      {activeFeature === 'dashboard' && (
        <DashboardView
          activeSubItem={activeSubItem}
          onNavigateToMarkets={() => navigateTo('markets', 'panel-lider')}
          onNavigateToBondDetail={() => {
            setSelectedBondTicker('AL30');
            navigateTo('bond-detail', 'calc');
          }}
        />
      )}

      {activeFeature === 'markets' && (
        <MarketsView
          activeSubItem={activeSubItem}
          onSelectBondDetail={(ticker) => {
            setSelectedBondTicker(ticker.replace('D', ''));
            navigateTo('bond-detail');
          }}
        />
      )}

      {activeFeature === 'lecaps-curve' && (
        <LecapsCurveView />
      )}

      {activeFeature === 'bond-detail' && (
        <BondDetailView
          initialTicker={selectedBondTicker}
          activeSubItem={activeSubItem}
          onBackToMarkets={() => navigateTo('markets', 'bonos-usd')}
        />
      )}

      {activeFeature === 'institutional-stats' && (
        <InstitutionalStatsView activeSubItem={activeSubItem} />
      )}

      {activeFeature === 'political-analysis' && (
        <PoliticalAnalysisView activeSubItem={activeSubItem} />
      )}

      {activeFeature === 'news-intelligence' && (
        <NewsIntelligenceView activeSubItem={activeSubItem} />
      )}

      {/* Financial AI Copilot Modal (100% Free) */}
      <FinancialAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Quick Currency Converter Modal */}
      <QuickCurrencyConverter
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
      />

      {/* Quick Search / Command Palette Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchFilter('');
        }}
        title="Búsqueda Rápida & Acceso a Módulos"
        subtitle="Navega directamente a cualquier indicador, activo o reporte"
        maxWidth="lg"
      >
        <div className="space-y-3 font-sans text-xs">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-outline" />
            <input
              type="text"
              autoFocus
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Escribe el nombre del módulo o activo (ej: Lecaps, AL30, Conversor, BCRA, Merval, Dólar)..."
              className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-surface-container-high rounded-xl text-xs font-sans focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-1 pt-1">
            <span className="font-eyebrow text-outline block px-1">
              Destinos Rápidos:
            </span>
            {filteredNavItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.feature === 'converter') {
                    setIsConverterOpen(true);
                  } else if (item.feature === 'ai-copilot') {
                    setIsAiModalOpen(true);
                  } else {
                    navigateTo(item.feature as any, (item as any).subItem);
                  }
                  setIsSearchOpen(false);
                  setSearchFilter('');
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-surface-container-low flex items-center justify-between group transition-colors border border-transparent hover:border-surface-container-highest"
              >
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <span className="p-1.5 bg-surface-container rounded-lg text-on-surface-variant group-hover:text-primary">
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </div>
                <ArrowRight
                  size={14}
                  className="text-outline group-hover:text-gold group-hover:translate-x-0.5 transition-transform"
                />
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};
