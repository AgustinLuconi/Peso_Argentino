import React, { useState } from 'react';
import { TopTickerBar } from './TopTickerBar';
import { Navbar } from './Navbar';
import { SidebarNavigation, NavigationFeatureId } from './SidebarNavigation';
import { Footer } from './Footer';

export interface MainLayoutProps {
  children: React.ReactNode;
  activeFeature: NavigationFeatureId;
  onSelectFeature: (featureId: NavigationFeatureId) => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  activeFeatureTitle?: string;
  onSearchClick?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeFeature,
  onSelectFeature,
  onRefreshData,
  isRefreshing = false,
  activeFeatureTitle,
  onSearchClick,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-gold-light selection:text-primary">
      {/* Top Continuous Ticker Bar */}
      <TopTickerBar />

      {/* Main Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onRefreshData={onRefreshData}
        isRefreshing={isRefreshing}
        activeFeatureTitle={activeFeatureTitle}
        onSearchClick={onSearchClick}
      />

      {/* Fluid Layout Container that leverages maximum available screen space */}
      <div className="flex-1 w-full max-w-[2400px] mx-auto px-3 sm:px-5 lg:px-6 2xl:px-8 3xl:px-10 py-4 sm:py-6 flex gap-4 lg:gap-6">
        {/* Sidebar */}
        <SidebarNavigation
          activeFeature={activeFeature}
          onSelectFeature={onSelectFeature}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0 flex flex-col gap-5 sm:gap-6">
          {children}
        </main>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};
