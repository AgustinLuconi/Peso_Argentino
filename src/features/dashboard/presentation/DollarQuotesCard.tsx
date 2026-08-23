import React, { useState } from 'react';
import { MarketQuote } from '../domain/MarketQuote';
import { Card } from '@core/ui/components/Card';
import { TrendIndicator } from '@core/ui/components/TrendIndicator';
import { MiniSparkline } from '@core/ui/components/MiniSparkline';
import { Badge } from '@core/ui/components/Badge';
import { DollarSign, ArrowRightLeft, ChevronDown } from 'lucide-react';

export interface DollarQuotesCardProps {
  quotes: MarketQuote[];
  onSelectQuote?: (quote: MarketQuote) => void;
}

export const DollarQuotesCard: React.FC<DollarQuotesCardProps> = ({
  quotes,
  onSelectQuote,
}) => {
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);

  const toggleExpand = (type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedQuote((prev) => (prev === type ? null : type));
  };

  const getQuoteDetails = (type: string, quote: MarketQuote) => {
    switch (type) {
      case 'oficial':
        return {
          parking: 'Inmediato (MULC)',
          taxes: 'Sin recargo (Comercio Exterior / Importación)',
          limit: 'Cupo mensual BCRA bajo DDJJ',
          market: 'Banco Central de la Rep. Argentina (MULC)',
          spreadDetail: `Spread de $${quote.spread.amount.toFixed(2)} (${quote.spreadPercent.format()})`,
        };
      case 'mep':
        return {
          parking: '1 día hábil (Bono AL30/GD30)',
          taxes: 'Exento de Impuesto PAIS y Ganancias',
          limit: 'Ilimitado para personas humanas y jurídicas',
          market: 'Bolsas y Mercados Argentinos (BYMA)',
          spreadDetail: 'Operación en pesos contra liquidación en USD local (Cuenta 7000)',
        };
      case 'ccl':
        return {
          parking: '1 día hábil para giro al exterior',
          taxes: 'Exento de retenciones impositivas',
          limit: 'Sin tope con fondos declarados',
          market: 'BYMA / Mercado de Valores Internacional (Cable)',
          spreadDetail: 'Permite transferencia de fondos a cuentas en Estados Unidos / Europa',
        };
      case 'tarjeta':
        return {
          parking: 'Inmediato en liquidación de resumen',
          taxes: '30% Imp. PAIS + 30% Percepción Ganancias (Total +60%)',
          limit: 'Límite crediticio de la tarjeta emisora',
          market: 'Entidades Financieras / Tarjetas de Crédito',
          spreadDetail: 'Aplica a consumos en moneda extranjera y plataformas de streaming',
        };
      case 'cripto':
        return {
          parking: 'Inmediato 24/7/365 (Sin feriados bancarios)',
          taxes: 'Sin impuestos bancarios directos',
          limit: 'P2P o exchange regulado según KYC',
          market: 'Plataformas Cripto (USDT / USDC)',
          spreadDetail: 'Cotización en tiempo real cotizando con paridad 1:1 contra dólar billete',
        };
      case 'blue':
        return {
          parking: 'Inmediato en efectivo',
          taxes: 'Mercado informal no bancarizado',
          limit: 'Sujeto a disponibilidad de efectivo en plaza',
          market: 'Mercado Libre / Casas de Cambio Informales',
          spreadDetail: 'Referencia histórica para transacciones cotidianas en billetes físicos',
        };
      default:
        return {
          parking: 'Inmediato',
          taxes: 'Régimen general',
          limit: 'Regulado por BCRA',
          market: 'Mercado de Cambios Oficial',
          spreadDetail: 'Tipo de cambio mayorista interbancario',
        };
    }
  };

  return (
    <Card variant="default" accent="gold" className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container-highest pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary text-gold rounded-xl shrink-0 shadow-sm">
            <DollarSign size={18} />
          </div>
          <div>
            <h2 className="font-h2 text-base sm:text-lg text-primary">
              Monitor de Cotizaciones del Dólar
            </h2>
            <p className="font-subtitle text-xs">
              Mercado cambiario oficial, financiero y libre con ficha técnica desplegable
            </p>
          </div>
        </div>

        <Badge variant="gold" size="sm" className="self-start sm:self-center">
          ARGENTINA SPOT
        </Badge>
      </div>

      {/* Grid of Quotes with Expandable Drawer */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-7 gap-3 sm:gap-3.5 items-start">
        {quotes.map((quote) => {
          const isExpanded = expandedQuote === quote.type;
          const details = getQuoteDetails(quote.type, quote);

          return (
            <div
              key={quote.type}
              className={`bg-surface-container-low dark:bg-[#081124] border transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between group shadow-soft ${
                isExpanded
                  ? 'border-gold shadow-lg bg-champagne-light/30 dark:bg-[#101e3d]'
                  : 'border-surface-container-high dark:border-[#1a2744] hover:border-gold/60 hover:-translate-y-1 hover:shadow-md'
              }`}
            >
              {/* Card Body */}
              <div
                onClick={() => onSelectQuote && onSelectQuote(quote)}
                className="p-3.5 cursor-pointer flex flex-col gap-2"
              >
                {/* Top row: Name & 24h variation */}
                <div className="flex items-start justify-between gap-1">
                  <span className="font-sans font-bold text-xs sm:text-sm text-primary uppercase tracking-wide truncate">
                    {quote.name.split('(')[0]}
                  </span>
                  <TrendIndicator value={quote.variation24h.value} size="sm" />
                </div>

                {/* Middle row: Buy / Sell Prices */}
                <div className="grid grid-cols-2 gap-1.5 my-0.5">
                  <div className="bg-white/90 dark:bg-[#0c1730] p-2.5 rounded-xl border border-surface-container-highest dark:border-[#1a2744] transition-colors group-hover:border-gold/30 shadow-soft">
                    <span className="font-eyebrow text-[9px] block">
                      Compra
                    </span>
                    <span className="text-xs 2xl:text-sm font-mono-tabular font-bold text-on-surface">
                      {quote.buyPrice.format({ showCurrency: true })}
                    </span>
                  </div>
                  <div className="bg-white/90 dark:bg-[#0c1730] p-2.5 rounded-xl border border-surface-container-highest dark:border-[#1a2744] transition-colors group-hover:border-gold/30 shadow-soft">
                    <span className="font-eyebrow text-[9px] block">
                      Venta
                    </span>
                    <span className="text-xs 2xl:text-sm font-mono-tabular font-bold text-primary">
                      {quote.sellPrice.format({ showCurrency: true })}
                    </span>
                  </div>
                </div>

                {/* Bottom row: Spread & Sparkline */}
                <div className="pt-2 border-t border-surface-container-highest dark:border-[#1a2744] flex items-center justify-between text-[11px] font-sans text-on-surface-variant">
                  <div className="flex items-center gap-1 font-mono-tabular text-[10px]">
                    <ArrowRightLeft size={11} className="text-outline shrink-0" />
                    <span className="truncate">Spr: {quote.spread.format({ showCurrency: true })}</span>
                  </div>
                  <div className="w-14 h-5 shrink-0 ml-1">
                    <MiniSparkline
                      data={quote.historicalSparkline}
                      height={18}
                      color="auto"
                    />
                  </div>
                </div>
              </div>

              {/* Expand Toggle Button Bar */}
              <button
                onClick={(e) => toggleExpand(quote.type, e)}
                className="w-full px-3 py-1.5 bg-surface-container/60 dark:bg-[#0c1730] hover:bg-surface-container border-t border-surface-container-high dark:border-[#1a2744] text-[10px] font-sans font-bold text-primary flex items-center justify-between transition-colors select-none"
              >
                <span>{isExpanded ? 'Ocultar Ficha' : 'Ver Ficha Operativa'}</span>
                <ChevronDown
                  size={13}
                  className={`text-gold transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Animated Expandable Details Panel */}
              {isExpanded && (
                <div className="p-3 bg-white/95 dark:bg-[#0c1730] border-t border-gold/30 text-[11px] font-sans space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-soft">
                  <div className="space-y-1">
                    <span className="font-eyebrow text-[9px] block">Régimen Impositivo:</span>
                    <p className="text-on-surface text-[10px] leading-snug">{details.taxes}</p>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-surface-container-high dark:border-[#1a2744]">
                    <span className="font-eyebrow text-[9px] block">Parking & Liquidación:</span>
                    <p className="text-on-surface text-[10px] leading-snug">{details.parking}</p>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-surface-container-high dark:border-[#1a2744]">
                    <span className="font-eyebrow text-[9px] block">Mercado / Ámbito:</span>
                    <p className="text-on-surface text-[10px] leading-snug">{details.market}</p>
                  </div>

                  <div className="pt-1 border-t border-surface-container-high dark:border-[#1a2744]">
                    <span className="font-eyebrow text-[9px] block">Operatividad:</span>
                    <p className="text-on-surface-variant text-[10px] leading-snug">{details.spreadDetail}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
