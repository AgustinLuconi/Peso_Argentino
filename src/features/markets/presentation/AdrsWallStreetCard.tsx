import React from 'react';
import { MarketAsset } from '../domain/MarketAsset';
import { Card } from '@core/ui/components/Card';
import { TrendIndicator } from '@core/ui/components/TrendIndicator';
import { MiniSparkline } from '@core/ui/components/MiniSparkline';
import { Globe } from 'lucide-react';

export const AdrsWallStreetCard: React.FC<{ adrs: MarketAsset[] }> = ({
  adrs,
}) => {
  return (
    <Card variant="default" accent="none" className="space-y-3.5">
      <div className="flex items-center justify-between border-b border-surface-container-highest pb-2.5">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-gold" />
          <h2 className="font-h3 text-sm sm:text-base">
            ADRs Argentinos en Wall Street (NYSE / NASDAQ)
          </h2>
        </div>
        <span className="font-eyebrow text-outline">
          Valores en USD spot
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {adrs.map((adr) => (
          <div
            key={adr.ticker}
            className="p-3.5 bg-surface-container-low hover:bg-surface-container border border-surface-container-high rounded-2xl transition-all duration-200 hover:-translate-y-1 shadow-soft flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-sans font-bold text-xs sm:text-sm text-primary block">
                  {adr.ticker}
                </span>
                <span className="text-[11px] font-sans text-on-surface-variant truncate block max-w-[110px]">
                  {adr.name}
                </span>
              </div>
              <TrendIndicator value={adr.variation24h.value} size="sm" />
            </div>

            <div className="my-2 flex items-baseline justify-between">
              <span className="text-sm sm:text-base font-mono-tabular font-bold text-primary">
                {adr.lastPrice.format()}
              </span>
              <div className="w-14 h-4">
                <MiniSparkline data={adr.sparkline} height={16} color="auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
