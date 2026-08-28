import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Landmark,
  Scale,
  Newspaper,
  Calculator,
  ChevronDown,
  Shield,
  X,
  CircleDot,
  Layers,
} from 'lucide-react';
import { clsx } from 'clsx';

export type NavigationFeatureId =
  | 'dashboard'
  | 'markets'
  | 'lecaps-curve'
  | 'bond-detail'
  | 'institutional-stats'
  | 'political-analysis'
  | 'news-intelligence';

export interface SidebarNavigationProps {
  activeFeature: NavigationFeatureId;
  activeSubItem?: string | null;
  onSelectFeature: (featureId: NavigationFeatureId, subItemId?: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface SubItem {
  id: string;
  label: string;
}

interface NavItem {
  id: NavigationFeatureId;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  badge?: string;
  subItems?: SubItem[];
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeFeature,
  activeSubItem,
  onSelectFeature,
  isOpen,
  onClose,
}) => {
  const [expandedMenu, setExpandedMenu] = useState<NavigationFeatureId | null>(activeFeature);

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Principal',
      sublabel: 'Dólar, Brecha & Macro Oficial',
      icon: <LayoutDashboard size={18} />,
      badge: 'EN VIVO',
      subItems: [
        { id: 'quotes', label: 'Cotizaciones Dólar (DolarApi)' },
        { id: 'macro', label: 'KPIs Macroeconómicos BCRA' },
        { id: 'breach', label: 'Brecha Cambiaria Oficial vs CCL' },
      ],
    },
    {
      id: 'markets',
      label: 'Mercados & Renta Fija',
      sublabel: 'BYMA, Merval, Bonos & CEDEARs',
      icon: <TrendingUp size={18} />,
      badge: 'BYMA',
      subItems: [
        { id: 'panel-lider', label: 'Panel Líder BYMA' },
        { id: 'panel-general', label: 'Panel General' },
        { id: 'cedears', label: 'CEDEARs en Wall Street' },
        { id: 'sovereign-bonds', label: 'Bonos Hard Dollar (AL/GD)' },
        { id: 'bopreal', label: 'Curva Bopreal BCRA' },
        { id: 'cer-bonds', label: 'Bonos Tasa Fija & CER' },
        { id: 'adrs', label: 'ADRs Argentinos en NYSE' },
        { id: 'commodities', label: 'Commodities del Agro (Matba)' },
      ],
    },
    {
      id: 'lecaps-curve',
      label: 'Curva de Lecaps',
      sublabel: 'Tasas ETTI, TEM & TNA Tesoro',
      icon: <Layers size={18} />,
      badge: 'TASA FIJA',
      subItems: [
        { id: 'curve-chart', label: 'Estructura ETTI (SVG Dinámico)' },
        { id: 'arbitrage', label: 'Estrategias de Carry Trade' },
        { id: 'table', label: 'Detalle de Letras & Boncaps' },
      ],
    },
    {
      id: 'bond-detail',
      label: 'Análisis Bono AL30',
      sublabel: 'Calculadora TIR, Paridad & Cash Flow',
      icon: <Calculator size={18} />,
      badge: 'CALCULADORA',
      subItems: [
        { id: 'technical', label: 'Ficha Técnica & Amortización' },
        { id: 'calculator', label: 'Calculadora de TIR y Rendimiento' },
        { id: 'cashflow', label: 'Cronograma de Cupones 2025-2030' },
      ],
    },
    {
      id: 'institutional-stats',
      label: 'Estadísticas BCRA',
      sublabel: 'Balance, Reservas & Agregados',
      icon: <Landmark size={18} />,
      badge: 'OFICIAL',
      subItems: [
        { id: 'balance', label: 'Balance General BCRA' },
        { id: 'series', label: 'Series Comparativas Macro' },
        { id: 'carry', label: 'Carry Trade & Tasas Reales' },
        { id: 'rates', label: 'Tasas de Interés y Plazo Fijo' },
      ],
    },
    {
      id: 'political-analysis',
      label: 'Análisis Político',
      sublabel: 'Gobernabilidad, Leyes & RIGI',
      icon: <Scale size={18} />,
      badge: 'RIGI',
      subItems: [
        { id: 'radar', label: 'Radar de Riesgo Político' },
        { id: 'rigi', label: 'Pipeline de Inversiones RIGI' },
        { id: 'laws', label: 'Monitoreo de Leyes & DNU' },
      ],
    },
    {
      id: 'news-intelligence',
      label: 'Intelligence Feed',
      sublabel: 'Noticias en Tiempo Real & IA',
      icon: <Newspaper size={18} />,
      badge: 'IA FEED',
      subItems: [
        { id: 'brief', label: 'Síntesis Ejecutiva con IA' },
        { id: 'critical', label: 'Cables de Impacto Crítico' },
      ],
    },
  ];

  const handleItemClick = (id: NavigationFeatureId) => {
    onSelectFeature(id);
    setExpandedMenu((prev) => (prev === id ? null : id));
  };

  const handleSubItemClick = (featureId: NavigationFeatureId, subItemId: string) => {
    onSelectFeature(featureId, subItemId);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 lg:top-[4.5rem] left-0 z-50 lg:z-30 h-full lg:h-[calc(100vh-5.5rem)] w-72 2xl:w-80 3xl:w-84 bg-white/95 dark:bg-[#090C10]/95 backdrop-blur-md border-r border-surface-container-highest dark:border-[#1E2638] transition-all duration-300 ease-out flex flex-col justify-between overflow-y-auto shrink-0 shadow-lg lg:shadow-none lg:rounded-2xl lg:border',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Navigation List */}
        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
          {/* Mobile Header with Close Button */}
          <div className="flex items-center justify-between lg:hidden border-b border-surface-container-highest dark:border-[#1E2638] pb-3">
            <div className="flex items-center gap-2">
              <img
                src="/favicon.svg"
                alt="Sol de Mayo"
                className="w-6 h-6 object-contain"
              />
              <span className="font-sans font-black text-base text-slate-900 dark:text-white uppercase">
                PESO ARGENTINO
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-outline dark:text-slate-400 hover:text-emerald-500 hover:bg-surface-container dark:hover:bg-[#131822]"
              aria-label="Cerrar menú"
            >
              <X size={18} />
            </button>
          </div>
          <div>
            <div className="px-3 pb-2 font-eyebrow text-outline dark:text-slate-400 font-bold tracking-wider">
              Módulos Institucionales
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = activeFeature === item.id;
                const isMenuOpen = expandedMenu === item.id;

                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className={clsx(
                        'w-full text-left p-2.5 sm:p-3 rounded-xl transition-all duration-200 flex items-start gap-2.5 sm:gap-3 group relative border select-none',
                        isActive
                          ? 'bg-slate-950 dark:bg-[#131822] text-white dark:text-emerald-400 border-slate-800 dark:border-emerald-500/50 shadow-emerald-glow scale-[1.02]'
                          : 'bg-white dark:bg-[#0F141C] hover:bg-slate-100 dark:hover:bg-[#161B26] text-slate-900 dark:text-slate-100 border-transparent hover:border-surface-container-highest dark:hover:border-[#1E2638] hover:translate-x-1'
                      )}
                    >
                      <span
                        className={clsx(
                          'p-2 rounded-lg shrink-0 transition-colors',
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-100 dark:bg-[#161B26] text-slate-600 dark:text-slate-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400'
                        )}
                      >
                        {item.icon}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={clsx(
                              'font-sans font-bold text-xs 2xl:text-sm truncate transition-colors',
                              isActive
                                ? 'text-white dark:text-emerald-400'
                                : 'text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                            )}
                          >
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className={clsx(
                                'text-[10px] font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap inline-flex items-center justify-center shrink-0 leading-tight',
                                isActive
                                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                                  : 'bg-surface-container dark:bg-[#161B26] text-on-surface-variant dark:text-slate-300 border dark:border-[#1E2638]'
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p
                          className={clsx(
                            'text-[11px] 2xl:text-xs font-sans truncate mt-0.5 transition-colors',
                            isActive
                              ? 'text-slate-300 dark:text-emerald-300/80'
                              : 'text-on-surface-variant dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                          )}
                        >
                          {item.sublabel}
                        </p>
                      </div>

                      <div className="shrink-0 self-center text-outline-variant dark:text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-slate-100 transition-transform duration-200">
                        <ChevronDown
                          size={14}
                          className={clsx(
                            'transition-transform duration-200',
                            isMenuOpen ? 'rotate-180 text-emerald-400' : ''
                          )}
                        />
                      </div>
                    </button>

                    {/* Expandable Sub-items Accordion */}
                    {isMenuOpen && item.subItems && (
                      <div className="pl-9 pr-2 py-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {item.subItems.map((sub) => {
                          const isSubActive = isActive && activeSubItem === sub.id;

                          return (
                            <button
                              key={sub.id}
                              onClick={() => handleSubItemClick(item.id, sub.id)}
                              className={clsx(
                                'w-full text-left py-1.5 px-3 rounded-lg text-xs font-sans transition-all duration-150 flex items-center gap-2 group',
                                isSubActive
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border-l-2 border-emerald-500'
                                  : 'text-on-surface-variant dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-surface-container dark:hover:bg-[#161B26]'
                              )}
                            >
                              <CircleDot
                                size={10}
                                className={clsx(
                                  'shrink-0 transition-colors',
                                  isSubActive
                                    ? 'text-emerald-500 fill-emerald-500'
                                    : 'text-outline dark:text-slate-500 group-hover:text-emerald-400'
                                )}
                              />
                              <span className="truncate">{sub.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Quick Institutional Summary Card in Sidebar */}
          <div className="p-3.5 bg-surface-container-low dark:bg-[#0F141C] border border-surface-container-highest dark:border-[#1E2638] rounded-xl shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-emerald-400 mb-1">
              <Shield size={14} className="text-emerald-500" />
              <span className="font-sans font-bold text-xs uppercase tracking-wide">
                Régimen Monetario
              </span>
            </div>
            <p className="text-[11px] font-sans text-on-surface-variant dark:text-slate-300 leading-relaxed">
              Fase 2 de Estabilización: Ancla fiscal, saneamiento del balance BCRA y flotación administrada.
            </p>
            <div className="mt-2 pt-2 border-t border-surface-container dark:border-[#1E2638] flex items-center justify-between text-[10px] font-sans text-outline dark:text-slate-400">
              <span>Superávit Financiero</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">+0,4% PBI</span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 sm:p-4 border-t border-surface-container-highest dark:border-[#1E2638] bg-surface-container-lowest dark:bg-[#070A0E] lg:rounded-b-2xl">
          <div className="text-[11px] font-sans text-on-surface-variant dark:text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-slate-900 dark:text-slate-200">Peso Argentino Terminal</span>
            <span className="font-mono text-emerald-500 text-[10px] font-bold">ONLINE ●</span>
          </div>
        </div>
      </aside>
    </>
  );
};
