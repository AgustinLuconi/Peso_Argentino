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
import { CommandPaletteModal } from '@core/ui/components/CommandPaletteModal';
import { KeyboardShortcutsModal } from '@core/ui/components/KeyboardShortcutsModal';
import { ErrorBoundary } from '@core/ui/components/ErrorBoundary';

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
    displayCurrency,
    setDisplayCurrency,
  } = useApp();

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Global Keyboard Shortcuts (⌘K, ⌘J, ⌘U, ?, 1-7)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      // ⌘K / Ctrl+K -> Command Palette & Quick Calculator
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }

      // ⌘J / Ctrl+J -> AI Copilot
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsAiModalOpen(true);
        return;
      }

      // ⌘U / Ctrl+U -> Toggle Currency ARS/USD
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        setDisplayCurrency(displayCurrency === 'ARS' ? 'USD' : 'ARS');
        return;
      }

      // Single-key shortcuts when not typing in an input
      if (!isInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
          e.preventDefault();
          setIsShortcutsOpen(true);
        } else if (e.key === '1') {
          navigateTo('dashboard');
        } else if (e.key === '2') {
          navigateTo('markets');
        } else if (e.key === '3') {
          navigateTo('lecaps-curve');
        } else if (e.key === '4') {
          navigateTo('bond-detail');
        } else if (e.key === '5') {
          navigateTo('institutional-stats');
        } else if (e.key === '6') {
          navigateTo('political-analysis');
        } else if (e.key === '7') {
          navigateTo('news-intelligence');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen, setIsAiModalOpen, displayCurrency, setDisplayCurrency, navigateTo]);

  const featureTitles: Record<string, string> = {
    dashboard: 'Dashboard Principal & Cotizaciones Dólar',
    markets: 'Mercados & Renta Fija (BYMA / NYSE)',
    'lecaps-curve': 'Curva de Rendimientos Lecaps & Boncaps del Tesoro',
    'bond-detail': `Ficha Técnica & Renta Fija (${selectedBondTicker})`,
    'institutional-stats': 'Estadísticas BCRA, Reservas & Carry Trade',
    'political-analysis': 'Análisis Político, Gobernabilidad & RIGI',
    'news-intelligence': 'Intelligence Feed & Noticias Financieras',
  };

  return (
    <MainLayout
      activeFeature={activeFeature}
      activeSubItem={activeSubItem}
      onSelectFeature={(feature, sub) => navigateTo(feature, sub)}
      onRefreshData={refreshAllData}
      isRefreshing={isRefreshing}
      activeFeatureTitle={featureTitles[activeFeature]}
      onSearchClick={() => setIsSearchOpen(true)}
      onOpenShortcuts={() => setIsShortcutsOpen(true)}
    >
      {/* Route Switcher wrapped in ErrorBoundary */}
      <ErrorBoundary
        key={activeFeature}
        fallbackTitle="Módulo en actualización de datos"
        fallbackDescription="Estamos sincronizando los indicadores y cotizaciones oficiales de este módulo. Puedes reintentar o navegar a otra sección."
      >
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
      </ErrorBoundary>

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

      {/* Advanced Command Palette & Quick Calculator Modal (⌘K) */}
      <CommandPaletteModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(feature, sub) => navigateTo(feature, sub)}
        onOpenAiCopilot={() => setIsAiModalOpen(true)}
        onOpenConverter={() => setIsConverterOpen(true)}
      />

      {/* Keyboard Shortcuts Cheat Sheet Modal (?) */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </MainLayout>
  );
};
