import React from 'react';
import { BondDetail } from '../domain/BondDetail';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { ArrowRightLeft } from 'lucide-react';

export const ParitySpreadCard: React.FC<{ bond: BondDetail }> = ({ bond }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Parity & Law Comparison */}
      <Card variant="default" accent="none" className="space-y-3.5">
        <div className="flex items-center justify-between border-b border-surface-container-highest pb-2.5">
          <h3 className="font-h3 text-sm sm:text-base text-primary">
            Paridad vs Ley Extranjera (Arbitraje AL30 / GD30)
          </h3>
          <Badge variant="gold" size="sm">
            SPREAD LEY
          </Badge>
        </div>

        <p className="text-xs font-sans text-on-surface-variant leading-relaxed">
          El diferencial de paridad entre títulos de ley local (AL30) y títulos de ley extranjera (GD30) refleja la prima de riesgo jurisdiccional. Históricamente este spread se ha comprimido durante procesos de normalización macroeconómica.
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1 font-sans text-xs">
          <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container shadow-soft">
            <span className="font-eyebrow text-outline block mb-1">AL30 (Ley Argentina)</span>
            <span className="font-mono-tabular font-bold text-primary text-sm">64,8% Paridad</span>
          </div>
          <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container shadow-soft">
            <span className="font-eyebrow text-outline block mb-1">GD30 (Ley NY)</span>
            <span className="font-mono-tabular font-bold text-secondary text-sm">68,1% Paridad</span>
          </div>
        </div>
      </Card>

      {/* Arbitrage & Canje */}
      <Card variant="default" accent="none" className="space-y-3.5">
        <div className="flex items-center justify-between border-b border-surface-container-highest pb-2.5">
          <h3 className="font-h3 text-sm sm:text-base text-primary">
            Arbitraje de Dólares (MEP vs Cable CCL)
          </h3>
          <div className="flex items-center gap-1">
            <ArrowRightLeft size={14} className="text-gold" />
            <span className="font-mono-tabular text-xs font-bold text-primary">
              Canje: {bond.canjeRatio.format()}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs font-sans">
          <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-xl border border-surface-container-high">
            <span className="text-on-surface-variant">Dólar Implícito MEP (AL30):</span>
            <span className="font-mono-tabular font-bold text-primary">
              ${bond.implicitMepDollar.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-xl border border-surface-container-high">
            <span className="text-on-surface-variant">Dólar Implícito Cable CCL (AL30C):</span>
            <span className="font-mono-tabular font-bold text-primary">
              ${bond.implicitCclDollar.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-champagne-light/50 border border-gold/30 rounded-xl">
            <span className="text-secondary font-semibold">Costo / Ganancia de Canje:</span>
            <span className="font-mono-tabular font-bold text-secondary">
              {bond.canjeRatio.format()}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
