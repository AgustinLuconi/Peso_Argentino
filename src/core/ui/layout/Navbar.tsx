import React from 'react';
import { Search, RefreshCw, Moon, Sun, ArrowRightLeft, Menu, Sparkles, Keyboard } from 'lucide-react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ApiStatusBadge } from '../components/ApiStatusBadge';
import { useApp } from '@app/providers/AppContext';

export interface NavbarProps {
  onToggleSidebar?: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  activeFeatureTitle?: string;
  onSearchClick?: () => void;
  onOpenShortcuts?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onRefreshData,
  isRefreshing = false,
  activeFeatureTitle = 'Dashboard Principal',
  onSearchClick,
  onOpenShortcuts,
}) => {
  const {
    theme,
    toggleTheme,
    setIsConverterOpen,
    setIsAiModalOpen,
    displayCurrency,
    setDisplayCurrency,
    navigateTo,
  } = useApp();

  const currentDate = new Date().toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleLogoClick = () => {
    navigateTo('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#090C10]/95 backdrop-blur-md border-b border-surface-container-highest dark:border-[#1E2638] shadow-xs transition-colors duration-200">
      <div className="w-full max-w-[2400px] mx-auto px-3 sm:px-5 lg:px-6 2xl:px-8 3xl:px-10 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Toggle & Brand Headline con Sol de Mayo */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-on-surface dark:text-slate-200 hover:bg-surface-container dark:hover:bg-[#131822] transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>

          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer rounded-xl p-1 -m-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all"
            title="Ir al Inicio (Dashboard)"
            aria-label="Ir al Inicio de Peso Argentino"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-soft group-hover:scale-105 group-active:scale-95 transition-transform duration-200 shrink-0">
              <img
                src="/favicon.svg"
                alt="Sol de Mayo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-sans font-extrabold text-base sm:text-xl text-slate-900 dark:text-white tracking-tight uppercase truncate group-hover:text-gold transition-colors">
                  PESO ARGENTINO
                </span>
                <Badge variant="emerald" size="sm" className="hidden sm:inline-flex">
                  TERMINAL
                </Badge>
              </div>
              <span className="text-[10px] sm:text-[11px] font-sans text-on-surface-variant dark:text-slate-400 hidden md:inline capitalize">
                {currentDate} · Bolsa & Mercados Argentinos
              </span>
            </div>
          </button>
        </div>

        {/* Center: Active View Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-surface-container-low dark:bg-[#0F141C] border border-surface-container-high dark:border-[#1E2638] rounded-xl shadow-xs">
          <span className="font-eyebrow text-outline dark:text-slate-400">
            Módulo Activo:
          </span>
          <span className="text-xs 2xl:text-sm font-sans font-bold text-slate-900 dark:text-emerald-400">
            {activeFeatureTitle}
          </span>
        </div>

        {/* Right: Currency Toggle, Copilot AI, Converter, Search, Theme, Refresh */}
        <div className="flex items-center gap-1.5 sm:gap-2 2xl:gap-3">
          {/* Live API Health Badge */}
          <div className="hidden sm:block">
            <ApiStatusBadge />
          </div>

          {/* Global Currency Toggle (ARS / USD) */}
          <div className="flex items-center p-0.5 bg-surface-container-low dark:bg-[#0F141C] border border-surface-container-highest dark:border-[#1E2638] rounded-xl shadow-xs">
            <button
              onClick={() => setDisplayCurrency('ARS')}
              className={`px-2 sm:px-2.5 py-1 text-[11px] font-sans font-bold rounded-lg transition-all ${
                displayCurrency === 'ARS'
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-glow scale-105 font-extrabold'
                  : 'text-on-surface-variant dark:text-slate-400 hover:text-emerald-500 dark:hover:text-white'
              }`}
              title="Visualizar montos y estadísticas en Pesos Argentinos ($ ARS - Atajo: ⌘U)"
            >
              🇦🇷 ARS
            </button>
            <button
              onClick={() => setDisplayCurrency('USD')}
              className={`px-2 sm:px-2.5 py-1 text-[11px] font-sans font-bold rounded-lg transition-all ${
                displayCurrency === 'USD'
                  ? 'bg-cyan-500 text-slate-950 shadow-cyan-glow scale-105 font-extrabold'
                  : 'text-on-surface-variant dark:text-slate-400 hover:text-cyan-500 dark:hover:text-white'
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
            icon={<Sparkles size={13} className="text-emerald-400 dark:text-slate-950 animate-pulse" />}
            className="hidden sm:inline-flex border border-emerald-500/30 hover:border-emerald-500 shadow-soft"
            title="Abrir Copiloto Financiero IA (100% Gratuito - ⌘J)"
          >
            <span className="font-sans font-bold flex items-center gap-1.5">
              Copiloto IA
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-500/20 dark:bg-slate-900 text-emerald-300 dark:text-emerald-400 rounded-full">GRATIS</span>
            </span>
          </Button>

          {/* Quick Currency Converter Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsConverterOpen(true)}
            icon={<ArrowRightLeft size={13} className="text-emerald-500" />}
            className="hidden xl:inline-flex"
            title="Abrir conversor de divisas instantáneo"
          >
            Conversor
          </Button>

          {/* Quick Search Button */}
          <button
            onClick={onSearchClick}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-sans text-on-surface-variant dark:text-slate-300 bg-surface-container-low dark:bg-[#0F141C] hover:bg-surface-container dark:hover:bg-[#131822] border border-surface-container-highest dark:border-[#1E2638] rounded-xl transition-colors"
            title="Buscar módulo, activo o calcular (⌘K)"
          >
            <Search size={14} className="text-outline dark:text-slate-400 shrink-0" />
            <span className="hidden md:inline">Buscar...</span>
            <kbd className="hidden sm:inline text-[9px] 2xl:text-[10px] font-mono px-1.5 py-0.5 bg-white dark:bg-[#131822] border border-outline-variant/40 dark:border-[#1E2638] rounded text-outline dark:text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Keyboard Shortcuts Button */}
          <button
            onClick={onOpenShortcuts}
            className="p-1.5 sm:p-2 rounded-xl text-on-surface-variant dark:text-slate-300 hover:text-emerald-500 hover:bg-surface-container dark:hover:bg-[#131822] transition-colors border border-surface-container-highest dark:border-[#1E2638] shrink-0 hidden sm:inline-flex"
            title="Atajos de teclado de la terminal (Presiona ?)"
            aria-label="Atajos de teclado"
          >
            <Keyboard size={16} />
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-on-surface-variant dark:text-slate-300 hover:text-emerald-500 hover:bg-surface-container dark:hover:bg-[#131822] transition-colors border border-surface-container-highest dark:border-[#1E2638] shrink-0"
            title={theme === 'light' ? 'Cambiar a Modo Terminal Obsidian' : 'Cambiar a Modo Claro'}
            aria-label="Cambiar tema"
          >
            {theme === 'light' ? (
              <Moon size={16} className="text-slate-700" />
            ) : (
              <Sun size={16} className="text-emerald-400" />
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
            <span className="hidden 2xl:inline">Actualizar</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
