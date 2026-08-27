import React from 'react';
import { TrendIndicator } from '../components/TrendIndicator';
import { ShieldCheck } from 'lucide-react';

export interface TickerItemData {
  symbol: string;
  name: string;
  price: string;
  change: number;
}

const DEFAULT_TICKERS: TickerItemData[] = [
  { symbol: 'USD/ARS', name: 'Oficial BNA', price: '$1.048,50', change: 0.15 },
  { symbol: 'USD/BLUE', name: 'Dólar Blue', price: '$1.220,00', change: -0.81 },
  { symbol: 'USD/MEP', name: 'Bolsa MEP', price: '$1.192,40', change: 0.32 },
  { symbol: 'USD/CCL', name: 'Contado c/ Liq', price: '$1.218,90', change: -0.25 },
  { symbol: 'USD/CRIPTO', name: 'Cripto USDT', price: '$1.215,00', change: 0.08 },
  { symbol: 'MERVAL', name: 'S&P Merval', price: '2.145.890', change: 1.84 },
  { symbol: 'AL30D', name: 'Bono AL30 USD', price: 'US$ 64,80', change: 1.25 },
  { symbol: 'GD30D', name: 'Bono GD30 USD', price: 'US$ 68,10', change: 0.95 },
  { symbol: 'RIESGO PAÍS', name: 'EMBI+ Arg', price: '505 bps', change: -1.60 },
  { symbol: 'RESERVAS', name: 'BCRA Brutas', price: 'US$ 30.412 M', change: 0.45 },
  { symbol: 'INFLACIÓN', name: 'IPC Mensual', price: '2,10%', change: -0.50 },
  { symbol: 'LEFI TNA', name: 'Tasa Política', price: '32,00%', change: 0.00 },
];

export const TopTickerBar: React.FC<{ customTickers?: TickerItemData[] }> = ({
  customTickers = DEFAULT_TICKERS,
}) => {
  // Duplicate for seamless infinite marquee loop
  const displayTickers = [...customTickers, ...customTickers];

  return (
    <div className="bg-primary text-white border-b border-gold/25 text-xs select-none overflow-hidden h-9 flex items-center relative z-20">
      {/* Live Badge Fixed at Left */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-primary-container text-gold border-r border-gold/30 shrink-0 z-10 h-full font-mono text-[11px] font-bold">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bullish-green opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
        </span>
        <span>MERCADO EN VIVO</span>
      </div>

      {/* Marquee Track */}
      <div className="overflow-hidden flex-1 relative flex items-center">
        <div className="animate-ticker flex items-center gap-6 py-1">
          {displayTickers.map((item, idx) => (
            <div
              key={`${item.symbol}-${idx}`}
              className="inline-flex items-center gap-2 shrink-0 px-2 font-mono-tabular text-xs border-r border-white/10 pr-6"
            >
              <span className="font-semibold text-white/90">{item.symbol}</span>
              <span className="text-gold font-bold">{item.price}</span>
              <TrendIndicator value={item.change} size="sm" showIcon={false} />
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Status Badge at Right */}
      <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-primary text-slate-300 shrink-0 font-sans text-[11px] border-l border-white/10 h-full">
        <ShieldCheck size={13} className="text-gold" />
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          BCRA & BYMA FEED
        </span>
      </div>
    </div>
  );
};
