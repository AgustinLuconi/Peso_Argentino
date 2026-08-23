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
  | 'bond-detail'
  | 'institutional-stats'
  | 'political-analysis'
  | 'news-intelligence';

export interface SidebarNavigationProps {
  activeFeature: NavigationFeatureId;
  onSelectFeature: (featureId: NavigationFeatureId) => void;
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
        { id: 'merval', label: 'Acciones Panel Líder' },
        { id: 'adrs', label: 'ADRs en Wall Street (USD)' },
        { id: 'bonds', label: 'Renta Fija Soberana' },
        { id: 'lecaps', label: 'Curva de Lecaps ARS' },
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

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-primary/70 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 lg:top-20 left-0 z-40 h-full lg:h-[calc(100vh-6rem)] w-72 2xl:w-80 3xl:w-84 bg-white/95 backdrop-blur-md border-r border-surface-container-highest transition-all duration-300 ease-out flex flex-col justify-between overflow-y-auto shrink-0 shadow-lg lg:shadow-none lg:rounded-2xl lg:border',
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
            <div className="px-3 pb-2 font-eyebrow text-outline">
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
                          : 'bg-white hover:bg-surface-container-low text-on-surface border-transparent hover:border-surface-container-highest hover:translate-x-1'
                      )}
                    >
                      <span
                        className={clsx(
                          'p-2 rounded-lg shrink-0 transition-colors',
                          isActive
                            ? 'bg-primary-container text-gold'
                            : 'bg-surface-container text-on-surface-variant group-hover:text-primary'
                        )}
                      >
                        {item.icon}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-sans font-bold text-xs 2xl:text-sm truncate">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className={clsx(
                                'text-[9px] font-mono px-1.5 py-0.5 rounded-full uppercase tracking-wider',
                                isActive
                                  ? 'bg-gold text-primary font-bold'
                                  : 'bg-surface-container text-on-surface-variant'
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p
                          className={clsx(
                            'text-[11px] 2xl:text-xs font-sans truncate mt-0.5',
                            isActive ? 'text-slate-300' : 'text-on-surface-variant'
                          )}
                        >
                          {item.sublabel}
                        </p>
                      </div>

                      <div className="shrink-0 self-center text-outline-variant group-hover:text-primary transition-transform duration-200">
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
                        {item.subItems.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              onSelectFeature(item.id);
                              onClose();
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-sans text-on-surface-variant hover:text-primary hover:bg-surface-container-low flex items-center gap-2 transition-colors"
                          >
                            <CircleDot size={10} className="text-gold shrink-0" />
                            <span className="truncate">{sub.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Quick Institutional Summary Card in Sidebar */}
          <div className="p-3.5 bg-surface-container-low border border-surface-container-highest rounded-xl">
            <div className="flex items-center gap-1.5 text-primary mb-1">
              <Shield size={14} className="text-gold" />
              <span className="font-sans font-bold text-xs uppercase tracking-wide">
                Régimen Monetario
              </span>
            </div>
            <p className="text-[11px] font-sans text-on-surface-variant leading-relaxed">
              Fase 2 de Estabilización: Ancla fiscal, saneamiento del balance BCRA y flotación administrada.
            </p>
            <div className="mt-2 pt-2 border-t border-surface-container flex items-center justify-between text-[10px] font-mono text-outline">
              <span>Superávit Financiero</span>
              <span className="text-bullish-green font-bold">+0,4% PBI</span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 sm:p-4 border-t border-surface-container-highest bg-surface-container-lowest lg:rounded-b-2xl">
          <div className="text-[11px] font-sans text-on-surface-variant flex items-center justify-between">
            <span className="font-semibold text-primary">Peso Argentino v3.5</span>
            <span className="font-mono text-outline">2026</span>
          </div>
        </div>
      </aside>
    </>
  );
};
