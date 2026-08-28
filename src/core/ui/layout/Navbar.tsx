import React from 'react';
import { Search, RefreshCw, Moon, Sun, ArrowRightLeft, Menu, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useApp } from '@app/providers/AppContext';

export interface NavbarProps {
  onToggleSidebar?: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  activeFeatureTitle?: string;
  onSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onRefreshData,
  isRefreshing = false,
  activeFeatureTitle = 'Dashboard Principal',
  onSearchClick,
}) => {
  const { theme, toggleTheme, setIsConverterOpen, setIsAiModalOpen, displayCurrency, setDisplayCurrency } = useApp();

  const currentDate = new Date().toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#040914]/95 backdrop-blur-md border-b border-surface-container-highest dark:border-[#1a2744] shadow-xs transition-colors duration-200">
      <div className="w-full max-w-[2400px] mx-auto px-3 sm:px-5 lg:px-6 2xl:px-8 3xl:px-10 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Toggle & Brand Headline */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <img
              src="/favicon.svg"
              alt="Peso Argentino - Sol de Mayo"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-soft shrink-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-sans font-extrabold text-base sm:text-xl text-primary tracking-tight uppercase truncate">
                  PESO ARGENTINO
                </span>
                <Badge variant="gold" size="sm" className="hidden sm:inline-flex">
                  INSTITUTIONAL
                </Badge>
              </div>
              <span className="text-[10px] sm:text-[11px] font-sans text-on-surface-variant hidden md:inline capitalize">
                {currentDate} · Bolsa & Mercados Argentinos
              </span>
            </div>
          </div>
        </div>

        {/* Center: Active View Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-surface-container-low dark:bg-[#0c1730] border border-surface-container-high dark:border-[#1a2744] rounded-xl shadow-xs">
          <span className="font-eyebrow text-outline dark:text-slate-400">
            Módulo Activo:
          </span>
          <span className="text-xs 2xl:text-sm font-sans font-bold text-primary dark:text-gold">
            {activeFeatureTitle}
          </span>
        </div>

        {/* Right: Currency Toggle, Copilot AI, Converter, Search, Theme, Refresh */}
        <div className="flex items-center gap-1.5 sm:gap-2 2xl:gap-3">
          {/* Global Currency Toggle (ARS / USD) */}
          <div className="flex items-center p-0.5 bg-surface-container-low dark:bg-[#0c1730] border border-surface-container-highest dark:border-[#1a2744] rounded-xl shadow-xs">
            <button
              onClick={() => setDisplayCurrency('ARS')}
              className={`px-2 sm:px-2.5 py-1 text-[11px] font-sans font-bold rounded-lg transition-all ${
                displayCurrency === 'ARS'
                  ? 'bg-gold text-slate-950 shadow-xs scale-105 font-extrabold'
                  : 'text-on-surface-variant hover:text-primary dark:hover:text-white'
              }`}
              title="Visualizar montos y estadísticas en Pesos Argentinos ($ ARS - Atajo: ⌘U)"
            >
              🇦🇷 ARS
            </button>
            <button
              onClick={() => setDisplayCurrency('USD')}
              className={`px-2 sm:px-2.5 py-1 text-[11px] font-sans font-bold rounded-lg transition-all ${
                displayCurrency === 'USD'
                  ? 'bg-blue-600 text-white shadow-xs scale-105 font-extrabold'
                  : 'text-on-surface-variant hover:text-primary dark:hover:text-white'
              }`}
              title="Visualizar montos y estadísticas en Dólares (US$ USD - Atajo: ⌘U)"
            >
              🇺🇸 USD
            </button>
          </div>
          {/* AI Copilot Button (100% Free) */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAiModalOpen(true)}
            icon={<Sparkles size={13} className="text-gold animate-pulse" />}
            className="hidden sm:inline-flex border border-gold/30 hover:border-gold shadow-soft"
            title="Abrir Copiloto Financiero IA (100% Gratuito - ⌘J)"
          >
            <span className="font-sans font-bold text-white flex items-center gap-1.5">
              Copiloto IA
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-gold/20 text-gold rounded-full">GRATIS</span>
            </span>
          </Button>

          {/* Quick Currency Converter Button */}
          <Button
            variant="gold"
            size="sm"
            onClick={() => setIsConverterOpen(true)}
            icon={<ArrowRightLeft size={13} />}
            className="hidden md:inline-flex"
            title="Abrir conversor de divisas instantáneo"
          >
            Conversor
          </Button>

          {/* Quick Search Button */}
          <button
            onClick={onSearchClick}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-sans text-on-surface-variant bg-surface-container-low hover:bg-surface-container border border-surface-container-highest rounded-xl transition-colors"
          >
            <Search size={14} className="text-outline shrink-0" />
            <span className="hidden md:inline">Buscar activo...</span>
            <kbd className="hidden sm:inline text-[9px] 2xl:text-[10px] font-mono px-1.5 py-0.5 bg-white dark:bg-[#0c1730] border border-outline-variant/40 rounded text-outline">
              ⌘K
            </kbd>
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border border-surface-container-highest shrink-0"
            title={theme === 'light' ? 'Cambiar a Modo Terminal Oscuro' : 'Cambiar a Modo Gaceta Claro'}
            aria-label="Cambiar tema"
          >
            {theme === 'light' ? (
              <Moon size={16} className="text-primary" />
            ) : (
              <Sun size={16} className="text-gold" />
            )}
          </button>

          {/* Refresh Data Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefreshData}
            loading={isRefreshing}
            icon={<RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />}
            className="hidden sm:inline-flex shrink-0"
            title="Actualizar cotizaciones en vivo"
          >
            <span className="hidden lg:inline">Actualizar</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
