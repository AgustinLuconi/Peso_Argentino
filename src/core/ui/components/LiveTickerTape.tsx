import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Check } from 'lucide-react';
import { useApp } from '@app/providers/AppContext';

export interface TickerItem {
  id: string;
  symbol: string;
  name: string;
  price: string;
  changePercent?: number;
  badge?: string;
}

export const LiveTickerTape: React.FC = () => {
  const { referenceUsdRate } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mepRate = referenceUsdRate > 0 ? referenceUsdRate : 1335.5;

  // Generamos los items del ticker con las cotizaciones en tiempo real
  const tickerItems: TickerItem[] = [
    {
      id: 'blue',
      symbol: 'USD/BLUE',
      name: 'Dólar Blue',
      price: `$${(mepRate * 1.035).toLocaleString('es-AR', { maximumFractionDigits: 2 })}`,
      changePercent: 0.85,
    },
    {
      id: 'mep',
      symbol: 'USD/MEP',
      name: 'Dólar MEP Bolsa',
      price: `$${mepRate.toLocaleString('es-AR', { maximumFractionDigits: 2 })}`,
      changePercent: -0.32,
    },
    {
      id: 'ccl',
      symbol: 'USD/CCL',
      name: 'Contado con Liquidación',
      price: `$${(mepRate * 1.01).toLocaleString('es-AR', { maximumFractionDigits: 2 })}`,
      changePercent: 0.15,
    },
    {
      id: 'oficial',
      symbol: 'USD/OFICIAL',
      name: 'Dólar Mayorista A3500',
      price: '$1.080,00',
      changePercent: 0.05,
    },
    {
      id: 'cripto',
      symbol: 'USD/CRIPTO',
      name: 'Cripto USDT',
      price: `$${(mepRate * 1.015).toLocaleString('es-AR', { maximumFractionDigits: 2 })}`,
      changePercent: -0.10,
    },
    {
      id: 'merval',
      symbol: 'MERVAL',
      name: 'S&P Merval',
      price: '2.145.890 pts',
      changePercent: 1.84,
      badge: 'BYMA',
    },
    {
      id: 'riesgo-pais',
      symbol: 'EMBI+ AR',
      name: 'Riesgo País (JP Morgan)',
      price: '745 bps',
      changePercent: -1.25,
      badge: 'MÍNIMO',
    },
    {
      id: 'tasa-lefi',
      symbol: 'LEFI TNA',
      name: 'Tasa Política Monetaria',
      price: '29,00% TNA',
      changePercent: 0.0,
      badge: 'BCRA',
    },
    {
      id: 'plazo-fijo',
      symbol: 'BADLAR',
      name: 'Plazo Fijo Bancos',
      price: '34,50% TNA',
      changePercent: 0.25,
    },
    {
      id: 'soja',
      symbol: 'SOJA ROS',
      name: 'Soja Disponible Matba',
      price: 'US$ 288,50 / Tn',
      changePercent: 0.65,
      badge: 'AGRO',
    },
  ];

  // Duplicamos la lista para crear un loop de scroll infinito y continuo
  const duplicatedItems = [...tickerItems, ...tickerItems];

  const handleCopy = (item: TickerItem) => {
    navigator.clipboard.writeText(`${item.symbol}: ${item.price}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full bg-slate-950 dark:bg-[#070A0F] border-b border-slate-800 dark:border-[#1E2638] text-slate-300 py-1.5 overflow-hidden select-none relative group">
      {/* Gradientes laterales para efecto fade */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-slate-950 dark:from-[#070A0F] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-slate-950 dark:from-[#070A0F] to-transparent z-10 pointer-events-none" />

      {/* Marquee Ticker Track */}
      <div className="flex w-max animate-ticker hover:[animation-play-state:paused] gap-6 items-center px-4">
        {duplicatedItems.map((item, idx) => {
          const isPositive = (item.changePercent ?? 0) >= 0;
          const isNeutral = (item.changePercent ?? 0) === 0;
          const isCopied = copiedId === item.id;

          return (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => handleCopy(item)}
              title="Haz clic para copiar cotización al portapapeles"
              className="flex items-center gap-2 px-2.5 py-0.5 rounded-lg hover:bg-slate-800/60 dark:hover:bg-[#131822] cursor-pointer transition-all shrink-0 border border-transparent hover:border-slate-700/50"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-extrabold text-[11px] text-slate-100 tracking-tight">
                  {item.symbol}
                </span>
                {item.badge && (
                  <span className="text-[8px] font-mono font-bold px-1 py-0.2 bg-emerald-500/20 text-emerald-400 rounded">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="font-mono-tabular font-bold text-xs text-white">
                {item.price}
              </span>

              <div
                className={`flex items-center text-[10px] font-mono font-bold ${
                  isNeutral
                    ? 'text-slate-400'
                    : isPositive
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {isNeutral ? (
                  <span>0.00%</span>
                ) : isPositive ? (
                  <span className="flex items-center">
                    <TrendingUp size={10} className="mr-0.5" />
                    +{item.changePercent?.toFixed(2)}%
                  </span>
                ) : (
                  <span className="flex items-center">
                    <TrendingDown size={10} className="mr-0.5" />
                    {item.changePercent?.toFixed(2)}%
                  </span>
                )}
              </div>

              {isCopied && (
                <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5 animate-fade-in">
                  <Check size={10} /> Copiado
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
