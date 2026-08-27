import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavigationFeatureId } from '@core/ui/layout/SidebarNavigation';

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

  const navigateTo = (feature: NavigationFeatureId, subItem?: string) => {
    setActiveFeature(feature);
    setActiveSubItem(subItem || null);
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

  // Global Keyboard Shortcuts (⌘K for search, ⌘J for AI Copilot)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsAiModalOpen((prev) => !prev);
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
