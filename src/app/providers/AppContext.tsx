import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavigationFeatureId } from '@core/ui/layout/SidebarNavigation';
import { Money, CurrencyCode } from '@core/domain/Money';

export interface AppContextType {
  activeFeature: NavigationFeatureId;
  setActiveFeature: (feature: NavigationFeatureId) => void;
  activeSubItem: string | null;
  setActiveSubItem: (subItem: string | null) => void;
  navigateTo: (feature: NavigationFeatureId, subItem?: string) => void;
  selectedBondTicker: string;
  setSelectedBondTicker: (ticker: string) => void;
  isRefreshing: boolean;
  refreshAllData: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isConverterOpen: boolean;
  setIsConverterOpen: (open: boolean) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  // Visualización monetaria (ARS / USD) y escalas
  displayCurrency: 'ARS' | 'USD';
  setDisplayCurrency: (currency: 'ARS' | 'USD') => void;
  toggleDisplayCurrency: () => void;
  referenceUsdRate: number;
  setReferenceUsdRate: (rate: number) => void;
  formatMoney: (amount: number, fromCurrency?: CurrencyCode, compact?: boolean) => string;
  getMoneyScale: (amount: number, currency?: CurrencyCode) => {
    formatted: string;
    scaleLabel: 'Billones' | 'Miles de Millones' | 'Millones' | 'Miles' | 'Unidades';
    compactValue: string;
    fullFormatted: string;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeFeature, setActiveFeature] = useState<NavigationFeatureId>('dashboard');
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const [selectedBondTicker, setSelectedBondTicker] = useState<string>('AL30');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isConverterOpen, setIsConverterOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Estado de moneda global (Pesos ARS o Dólares USD)
  const [displayCurrency, setDisplayCurrency] = useState<'ARS' | 'USD'>('ARS');
  const [referenceUsdRate, setReferenceUsdRate] = useState<number>(1215.0);

  const navigateTo = (feature: NavigationFeatureId, subItem?: string) => {
    setActiveFeature(feature);
    setActiveSubItem(subItem || null);
  };

  const toggleDisplayCurrency = () => {
    setDisplayCurrency((prev) => (prev === 'ARS' ? 'USD' : 'ARS'));
  };

  // Helper para formatear valores respetando la moneda seleccionada y las escalas
  const formatMoney = (amount: number, fromCurrency: CurrencyCode = 'ARS', compact: boolean = true): string => {
    if (displayCurrency === fromCurrency) {
      return Money.of(amount, fromCurrency).format({ compact });
    }
    // Convertir a la moneda de destino
    const converted = Money.convert(amount, fromCurrency, displayCurrency, referenceUsdRate);
    return converted.format({ compact });
  };

  const getMoneyScale = (amount: number, currency: CurrencyCode = displayCurrency) => {
    return Money.formatScale(amount, currency);
  };

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Global Keyboard Shortcuts (⌘K for search, ⌘J for AI Copilot, ⌘U for Currency toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsAiModalOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        toggleDisplayCurrency();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const refreshAllData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <AppContext.Provider
      value={{
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
        theme,
        toggleTheme,
        displayCurrency,
        setDisplayCurrency,
        toggleDisplayCurrency,
        referenceUsdRate,
        setReferenceUsdRate,
        formatMoney,
        getMoneyScale,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
