import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ArrowRight,
  TrendingUp,
  LayoutDashboard,
  Landmark,
  Scale,
  Newspaper,
  Calculator,
  Layers,
  ArrowRightLeft,
  Sparkles,
  Sun,
  Moon,
  DollarSign,
  Zap,
  Check,
} from 'lucide-react';
import { Badge } from './Badge';
import { useApp } from '@app/providers/AppContext';
import { NavigationFeatureId } from '../layout/SidebarNavigation';

export interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (feature: NavigationFeatureId, subItem?: string) => void;
  onOpenAiCopilot: () => void;
  onOpenConverter: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navegación' | 'Mercados & Activos' | 'Herramientas & Acciones';
  icon: React.ReactNode;
  badge?: string;
  keywords: string;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenAiCopilot,
  onOpenConverter,
}) => {
  const { theme, toggleTheme, displayCurrency, setDisplayCurrency, referenceUsdRate } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Evaluador de expresiones matemáticas / conversiones rápidas
  const calculatedResult = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return null;

    const mepRef = referenceUsdRate > 0 ? referenceUsdRate : 1335.5;

    // Detectar patrones de conversión tipo: "1000 usd", "100 usd a mep", "50000 ars a usd"
    const usdMatch = trimmed.match(/^(\d+(?:[.,]\d+)?)\s*(?:usd|dolares|u\$s|\$usd)(?:\s*(?:a|to|en)?\s*(blue|mep|ccl|oficial))?$/);
    if (usdMatch) {
      const amount = parseFloat(usdMatch[1].replace(',', '.'));
      const targetRateKey = usdMatch[2] || 'mep';
      let rate = mepRef;
      if (targetRateKey === 'blue') rate = mepRef * 1.035;
      else if (targetRateKey === 'ccl') rate = mepRef * 1.01;
      else if (targetRateKey === 'oficial') rate = 1080;
      else rate = mepRef;

      const convertedArs = amount * rate;
      return {
        type: 'conversion',
        title: `Conversión: US$ ${amount.toLocaleString('es-AR')} × $${rate.toLocaleString('es-AR', { maximumFractionDigits: 2 })}`,
        result: `$${convertedArs.toLocaleString('es-AR', { maximumFractionDigits: 2 })} ARS`,
        subtitle: `Cotización utilizada: Dólar ${targetRateKey.toUpperCase()} ($${rate.toLocaleString('es-AR', { maximumFractionDigits: 2 })})`,
      };
    }

    // Detectar cálculo matemático básico: ej: "5000 * 1350" o "1000000 / 1380"
    const mathMatch = trimmed.match(/^(\d+(?:[.,]\d+)?)\s*([\+\-\*\/])\s*(\d+(?:[.,]\d+)?)$/);
    if (mathMatch) {
      const a = parseFloat(mathMatch[1].replace(',', '.'));
      const op = mathMatch[2];
      const b = parseFloat(mathMatch[3].replace(',', '.'));
      let res = 0;
      if (op === '+') res = a + b;
      else if (op === '-') res = a - b;
      else if (op === '*') res = a * b;
      else if (op === '/' && b !== 0) res = a / b;

      return {
        type: 'math',
        title: `Cálculo: ${a} ${op} ${b}`,
        result: `${res.toLocaleString('es-AR', { maximumFractionDigits: 4 })}`,
        subtitle: 'Resultado de la operación matemática instantánea',
      };
    }

    return null;
  }, [query, referenceUsdRate]);

  const allItems: CommandItem[] = useMemo(() => {
    return [
      // Herramientas & Acciones
      {
        id: 'toggle-currency',
        title: `Alternar Moneda: Cambiar a ${displayCurrency === 'ARS' ? 'USD (Dólares)' : 'ARS (Pesos)'}`,
        category: 'Herramientas & Acciones',
        icon: <DollarSign size={16} className="text-emerald-500" />,
        badge: '⌘U',
        keywords: 'moneda divisa dolares pesos usd ars toggle switch',
        action: () => setDisplayCurrency(displayCurrency === 'ARS' ? 'USD' : 'ARS'),
      },
      {
        id: 'toggle-theme',
        title: `Alternar Tema: Cambiar a Modo ${theme === 'dark' ? 'Claro' : 'Oscuro'}`,
        category: 'Herramientas & Acciones',
        icon: theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-700" />,
        keywords: 'tema modo oscuro claro dark light theme color',
        action: toggleTheme,
      },
      {
        id: 'copilot-ai',
        title: 'Abrir Copiloto Financiero con Inteligencia Artificial',
        category: 'Herramientas & Acciones',
        icon: <Sparkles size={16} className="text-emerald-400" />,
        badge: 'GRATIS (⌘J)',
        keywords: 'copiloto ia inteligencia artificial gemini chat preguntas dudas',
        action: onOpenAiCopilot,
      },
      {
        id: 'converter-modal',
        title: 'Abrir Calculadora & Conversor de Divisas',
        category: 'Herramientas & Acciones',
        icon: <ArrowRightLeft size={16} className="text-cyan-400" />,
        keywords: 'conversor divisas cambio dolar mep blue ccl oficial calculo',
        action: onOpenConverter,
      },

      // Navegación a Módulos
      {
        id: 'nav-dashboard',
        title: 'Dashboard Principal: Dólar, Brecha & Variables Macro',
        category: 'Navegación',
        icon: <LayoutDashboard size={16} className="text-emerald-500" />,
        badge: 'Tecla 1',
        keywords: 'dashboard inicio dolar blue mep ccl oficial cotizaciones brecha macro reservas bcra',
        action: () => onNavigate('dashboard'),
      },
      {
        id: 'nav-markets',
        title: 'Mercados & Renta Fija: BYMA, Merval, Bonos & CEDEARs',
        category: 'Navegación',
        icon: <TrendingUp size={16} className="text-blue-500" />,
        badge: 'Tecla 2',
        keywords: 'mercados renta fija merval byma acciones bonos soberanos cedears adrs commodities',
        action: () => onNavigate('markets'),
      },
      {
        id: 'nav-lecaps',
        title: 'Curva de Lecaps & Boncaps: Tasas ETTI, TEM & TNA Tesoro',
        category: 'Navegación',
        icon: <Layers size={16} className="text-amber-500" />,
        badge: 'Tecla 3',
        keywords: 'curva lecaps boncaps letras tesoro tasa fija etti tem tna tea carry',
        action: () => onNavigate('lecaps-curve'),
      },
      {
        id: 'nav-al30',
        title: 'Análisis Bono AL30: Calculadora TIR, Paridad & Cronograma de Cupones',
        category: 'Navegación',
        icon: <Calculator size={16} className="text-indigo-500" />,
        badge: 'Tecla 4',
        keywords: 'bono al30 al30d al30c gd30 tir paridad calculadora cupones amortizacion cash flow',
        action: () => onNavigate('bond-detail'),
      },
      {
        id: 'nav-stats',
        title: 'Estadísticas BCRA: Balance, Reservas & Simulador de Carry Trade',
        category: 'Navegación',
        icon: <Landmark size={16} className="text-purple-500" />,
        badge: 'Tecla 5',
        keywords: 'estadisticas bcra balance reservas base monetaria carry trade simulador tasas plazos fijos lefis',
        action: () => onNavigate('institutional-stats'),
      },
      {
        id: 'nav-political',
        title: 'Análisis Político & Regulatorio: Gobernabilidad, Leyes & RIGI',
        category: 'Navegación',
        icon: <Scale size={16} className="text-rose-500" />,
        badge: 'Tecla 6',
        keywords: 'analisis politico gobernabilidad radar rigi leyes decretos dnu congreso',
        action: () => onNavigate('political-analysis'),
      },
      {
        id: 'nav-news',
        title: 'Intelligence Feed: Noticias Macroeconómicas en Tiempo Real',
        category: 'Navegación',
        icon: <Newspaper size={16} className="text-amber-400" />,
        badge: 'Tecla 7',
        keywords: 'noticias intelligence feed comunicados finanzas bloomberg ambito infobae cables',
        action: () => onNavigate('news-intelligence'),
      },

      // Activos Específicos
      {
        id: 'asset-al30',
        title: 'Bono Soberano AL30 (Bono República Argentina USD 2030)',
        category: 'Mercados & Activos',
        icon: <TrendingUp size={16} className="text-emerald-500" />,
        badge: 'BONO USD',
        keywords: 'al30 al30d bono soberano dolares',
        action: () => onNavigate('bond-detail'),
      },
      {
        id: 'asset-gd30',
        title: 'Bono Global GD30 (Ley Nueva York USD 2030)',
        category: 'Mercados & Activos',
        icon: <TrendingUp size={16} className="text-emerald-500" />,
        badge: 'GLOBAL NY',
        keywords: 'gd30 gd30d ley extranjera bono',
        action: () => onNavigate('markets', 'sovereign-bonds'),
      },
      {
        id: 'asset-s31o5',
        title: 'Letra del Tesoro S31O5 (Lecap Vencimiento Octubre 2025)',
        category: 'Mercados & Activos',
        icon: <Layers size={16} className="text-amber-500" />,
        badge: 'LECAP',
        keywords: 's31o5 s14o5 s28n5 lecap letra tesoro',
        action: () => onNavigate('lecaps-curve'),
      },
      {
        id: 'asset-ggal',
        title: 'Grupo Financiero Galicia (GGAL / BYMA)',
        category: 'Mercados & Activos',
        icon: <TrendingUp size={16} className="text-blue-500" />,
        badge: 'MERVAL',
        keywords: 'ggal galicia banco merval byma',
        action: () => onNavigate('markets', 'panel-lider'),
      },
      {
        id: 'asset-ypfd',
        title: 'YPF S.A. (YPFD / BYMA)',
        category: 'Mercados & Activos',
        icon: <TrendingUp size={16} className="text-blue-500" />,
        badge: 'MERVAL',
        keywords: 'ypfd ypf petroleo merval byma',
        action: () => onNavigate('markets', 'panel-lider'),
      },
    ];
  }, [displayCurrency, theme, toggleTheme, setDisplayCurrency, onNavigate, onOpenAiCopilot, onOpenConverter]);

  // Filtrado de items
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query, allItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Manejo de teclas de navegación (flecha arriba, flecha abajo, enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (calculatedResult) {
        navigator.clipboard.writeText(calculatedResult.result);
        onClose();
      } else if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0F141C] border border-surface-container-highest dark:border-[#1E2638] rounded-3xl max-w-2xl w-full shadow-tactile overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="relative p-4 border-b border-surface-container-highest dark:border-[#1E2638] flex items-center gap-3">
          <Search size={20} className="text-emerald-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar módulo, activo o calcular (ej: 'AL30', '1500 usd a mep', 'Carry', '5000 * 1350')..."
            className="w-full bg-transparent text-sm sm:text-base font-sans text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-surface-container dark:bg-[#131822]"
            >
              Borrar
            </button>
          )}
        </div>

        {/* Dynamic Calculator Result (si se detecta una operación matemática o conversión) */}
        {calculatedResult && (
          <div
            onClick={() => {
              navigator.clipboard.writeText(calculatedResult.result);
              onClose();
            }}
            className="p-3.5 sm:p-4 mx-3 my-2.5 bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/40 rounded-2xl cursor-pointer hover:bg-emerald-500/15 transition-colors flex items-center justify-between gap-2 min-w-0 overflow-hidden"
          >
            <div className="space-y-0.5 min-w-0 flex-1 overflow-hidden">
              <div className="flex items-center gap-2 min-w-0">
                <Zap size={15} className="text-emerald-500 shrink-0" />
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 truncate block">
                  {calculatedResult.title}
                </span>
              </div>
              <span className="text-lg sm:text-xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 block truncate tracking-tight">
                {calculatedResult.result}
              </span>
              <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 truncate">
                {calculatedResult.subtitle} · (Haz clic o Enter para copiar)
              </p>
            </div>

            <kbd className="hidden sm:inline-block px-2.5 py-1 text-xs font-mono font-bold bg-white dark:bg-[#0F141C] text-emerald-500 border border-emerald-500/30 rounded-xl shadow-xs shrink-0">
              Enter ↵
            </kbd>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-3 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-sans text-xs">
              No se encontraron comandos o activos para "<span className="font-bold text-slate-200">{query}</span>"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-2xl flex items-center justify-between transition-all duration-100 ${
                    isSelected
                      ? 'bg-slate-950 dark:bg-[#131822] text-white border border-slate-800 dark:border-emerald-500/40 shadow-emerald-glow'
                      : 'hover:bg-surface-container-low dark:hover:bg-[#161B26] text-slate-900 dark:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-surface-container dark:bg-[#161B26] text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.icon}
                    </span>

                    <div className="min-w-0">
                      <span
                        className={`font-sans font-bold text-xs sm:text-sm block truncate ${
                          isSelected ? 'text-white dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono block uppercase ${
                          isSelected ? 'text-slate-400 dark:text-emerald-300/70' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg uppercase ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 shadow-xs'
                            : 'bg-surface-container dark:bg-[#161B26] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#1E2638]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight
                      size={14}
                      className={isSelected ? 'text-emerald-400 translate-x-0.5 transition-transform' : 'text-slate-400'}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-3 bg-surface-container-low dark:bg-[#131822] border-t border-surface-container-highest dark:border-[#1E2638] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-[#0F141C] rounded border border-slate-300 dark:border-[#1E2638]">↑↓</kbd> Navegar</span>
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-[#0F141C] rounded border border-slate-300 dark:border-[#1E2638]">↵</kbd> Seleccionar</span>
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-[#0F141C] rounded border border-slate-300 dark:border-[#1E2638]">Esc</kbd> Cerrar</span>
          </div>

          <span className="text-emerald-500 font-bold hidden sm:inline">
            Terminal Financiera v2.0
          </span>
        </div>
      </div>
    </div>
  );
};
