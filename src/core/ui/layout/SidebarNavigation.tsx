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
  const [expandedMenu, setExpandedMenu] = useState<string | null>(activeFeature);

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Principal',
      sublabel: 'Cotizaciones Dólar, Brecha & Macro',
      icon: <LayoutDashboard size={18} />,
      subItems: [
        { id: 'quotes', label: 'Monitor de 7 Tipos de Dólar' },
        { id: 'macro', label: 'Variables Monetarias & Reservas' },
        { id: 'breach', label: 'Compresión de Brecha Cambiaria' },
      ],
    },
    {
      id: 'markets',
      label: 'Mercado de Capitales',
      sublabel: 'Panel Merval, ADRs & Renta Fija',
      icon: <TrendingUp size={18} />,
      badge: 'BYMA/NYSE',
      subItems: [
        { id: 'panel-lider', label: 'Acciones Panel Líder BYMA' },
        { id: 'panel-general', label: 'Panel General Secundario' },
        { id: 'curva-lecaps', label: 'Curva de Lecaps & Boncaps' },
        { id: 'adrs', label: 'ADRs Wall Street (USD)' },
        { id: 'cedears', label: 'CEDEARs en BYMA' },
        { id: 'bonos-usd', label: 'Bonos Soberanos en USD' },
        { id: 'bonos-pesos', label: 'Bonos Pesos & Curva CER' },
        { id: 'bonos-extranjeros', label: 'Bonos Extranjeros & Treasuries' },
        { id: 'commodities', label: 'Commodities Agro & Energía' },
      ],
    },
    {
      id: 'lecaps-curve',
      label: 'Curva de Lecaps & Boncaps',
      sublabel: 'Estructura Temporal TEM, TNA & TEA',
      icon: <TrendingUp size={18} className="text-gold" />,
      badge: 'TASA FIJA',
      subItems: [
        { id: 'chart', label: 'Gráfico Dinámico de Curva TEM' },
        { id: 'simulator', label: 'Simulador de Inversión en Pesos' },
        { id: 'table', label: 'Ficha Técnica & Tabla Comparativa' },
      ],
    },
    {
      id: 'bond-detail',
      label: 'Detalle Bono AL30 & Renta Fija',
      sublabel: 'Calculadora TIR, Paridad & Cupones',
      icon: <Calculator size={18} />,
      badge: 'INTERACTIVO',
      subItems: [
        { id: 'calc', label: 'Calculadora de Inversión USD/ARS' },
        { id: 'waterfall', label: 'Gráfico de Cascada de Flujo' },
        { id: 'schedule', label: 'Cronograma de Cobros hasta 2030' },
      ],
    },
    {
      id: 'institutional-stats',
      label: 'Estadísticas BCRA & Macro',
      sublabel: 'Base Monetaria, LEFIs, Tasas & Reservas',
      icon: <Landmark size={18} />,
      subItems: [
        { id: 'balance', label: 'Balance Consolidado BCRA' },
        { id: 'series', label: 'Comparador de Series INDEC' },
        { id: 'carry', label: 'Simulador de Tasa Real en Pesos' },
        { id: 'rates', label: 'Cuadro de Tasas TNA/TEA/TEM' },
      ],
    },
    {
      id: 'political-analysis',
      label: 'Análisis Político & Regulatorio',
      sublabel: 'Monitor Legislativo, DNU & Gobernabilidad',
      icon: <Scale size={18} />,
      badge: 'RADAR',
      subItems: [
        { id: 'radar', label: 'Radar de Gobernabilidad' },
        { id: 'rigi', label: 'Pipeline de Proyectos RIGI' },
        { id: 'laws', label: 'Monitor de Leyes y Decretos' },
      ],
    },
    {
      id: 'news-intelligence',
      label: 'Intelligence & Noticias',
      sublabel: 'Feed de Alto Impacto Macroeconómico',
      icon: <Newspaper size={18} />,
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
          className="fixed inset-0 bg-primary/70 backdrop-blur-md z-50 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 lg:top-[4.5rem] left-0 z-50 lg:z-30 h-full lg:h-[calc(100vh-5.5rem)] w-72 2xl:w-80 3xl:w-84 bg-white/95 dark:bg-[#081124]/95 backdrop-blur-md border-r border-surface-container-highest dark:border-[#1a2744] transition-all duration-300 ease-out flex flex-col justify-between overflow-y-auto shrink-0 shadow-lg lg:shadow-none lg:rounded-2xl lg:border',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Navigation List */}
        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
          {/* Mobile Header with Close Button */}
          <div className="flex items-center justify-between lg:hidden border-b border-surface-container-highest pb-3">
            <span className="font-sans font-black text-base text-primary uppercase">
              MENÚ INSTITUCIONAL
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-outline hover:text-primary hover:bg-surface-container"
              aria-label="Cerrar menú"
            >
              <X size={18} />
            </button>
          </div>

          <div>
            <div className="px-3 pb-2 font-eyebrow text-outline dark:text-slate-300 font-bold tracking-wider">
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
                          ? 'bg-primary text-white border-primary shadow-md scale-[1.02] stroke-of-value'
                          : 'bg-white dark:bg-[#0c1730] hover:bg-surface-container-low dark:hover:bg-[#101e3d] text-on-surface dark:text-slate-100 border-transparent hover:border-surface-container-highest dark:hover:border-[#1a2744] hover:translate-x-1'
                      )}
                    >
                      <span
                        className={clsx(
                          'p-2 rounded-lg shrink-0 transition-colors',
                          isActive
                            ? 'bg-primary-container text-gold'
                            : 'bg-surface-container dark:bg-[#14244a] text-on-surface-variant dark:text-slate-300 group-hover:text-primary dark:group-hover:text-gold'
                        )}
                      >
                        {item.icon}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-sans font-bold text-xs 2xl:text-sm truncate text-primary dark:text-slate-100">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className={clsx(
                                'text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap inline-flex items-center justify-center shrink-0 leading-tight',
                                isActive
                                  ? 'bg-gold text-primary shadow-xs'
                                  : 'bg-surface-container dark:bg-[#14244a] text-on-surface-variant dark:text-slate-300 border dark:border-[#1a2744]'
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p
                          className={clsx(
                            'text-[11px] 2xl:text-xs font-sans truncate mt-0.5',
                            isActive ? 'text-slate-300' : 'text-on-surface-variant dark:text-slate-400'
                          )}
                        >
                          {item.sublabel}
                        </p>
                      </div>

                      <div className="shrink-0 self-center text-outline-variant dark:text-slate-400 group-hover:text-primary dark:group-hover:text-slate-100 transition-transform duration-200">
                        <ChevronDown
                          size={14}
                          className={clsx(
                            'transition-transform duration-200',
                            isMenuOpen ? 'rotate-180 text-gold' : ''
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
                                'w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-sans flex items-center gap-2 transition-all',
                                isSubActive
                                  ? 'bg-primary-container/30 dark:bg-gold/15 text-primary dark:text-gold font-bold shadow-sm'
                                  : 'text-on-surface-variant dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-surface-container-low dark:hover:bg-[#101e3d]'
                              )}
                            >
                              <CircleDot
                                size={10}
                                className={clsx(
                                  'shrink-0',
                                  isSubActive ? 'text-gold scale-125' : 'text-outline dark:text-slate-400'
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
          <div className="p-3.5 bg-surface-container-low dark:bg-[#0c1730] border border-surface-container-highest dark:border-[#1a2744] rounded-xl shadow-xs">
            <div className="flex items-center gap-1.5 text-primary dark:text-gold mb-1">
              <Shield size={14} className="text-gold" />
              <span className="font-sans font-bold text-xs uppercase tracking-wide">
                Régimen Monetario
              </span>
            </div>
            <p className="text-[11px] font-sans text-on-surface-variant dark:text-slate-300 leading-relaxed">
              Fase 2 de Estabilización: Ancla fiscal, saneamiento del balance BCRA y flotación administrada.
            </p>
            <div className="mt-2 pt-2 border-t border-surface-container dark:border-[#1a2744] flex items-center justify-between text-[10px] font-sans text-outline dark:text-slate-400">
              <span>Superávit Financiero</span>
              <span className="text-bullish-green dark:text-teal-400 font-bold">+0,4% PBI</span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 sm:p-4 border-t border-surface-container-highest dark:border-[#1a2744] bg-surface-container-lowest dark:bg-[#050b18] lg:rounded-b-2xl">
          <div className="text-[11px] font-sans text-on-surface-variant dark:text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-primary dark:text-slate-200">Peso Argentino v3.5</span>
            <span className="font-sans text-outline dark:text-slate-400 font-semibold">2026</span>
          </div>
        </div>
      </aside>
    </>
  );
};
