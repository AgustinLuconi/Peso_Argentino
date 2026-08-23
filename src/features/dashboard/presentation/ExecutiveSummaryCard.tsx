import React from 'react';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { ShieldCheck, ArrowUpRight, Flame, Scale } from 'lucide-react';

export const ExecutiveSummaryCard: React.FC = () => {
  return (
    <Card variant="navy" accent="gold" className="text-white space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gold/20 text-gold rounded-xl shrink-0">
            <ShieldCheck size={18} />
          </div>
          <h3 className="font-h3 text-base sm:text-lg text-white">
            Resumen Ejecutivo del Régimen Monetario & Fiscal
          </h3>
        </div>
        <Badge variant="gold" size="sm">
          FASE 2 VIGENTE
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1 */}
        <div className="bg-primary/60 p-4 rounded-2xl border border-gold/20 space-y-1.5 shadow-soft">
          <div className="flex items-center justify-between text-gold text-xs font-bold font-sans uppercase">
            <span className="font-eyebrow text-gold">1. Emisión Cero</span>
            <Flame size={14} />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Cierre de los grifos de emisión monetaria por déficit fiscal y por pasivos remunerados del BCRA. Traspaso a títulos del Tesoro (LEFIs).
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-primary/60 p-4 rounded-2xl border border-gold/20 space-y-1.5 shadow-soft">
          <div className="flex items-center justify-between text-gold text-xs font-bold font-sans uppercase">
            <span className="font-eyebrow text-gold">2. Ancla Fiscal</span>
            <Scale size={14} />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Superávit financiero en base caja mensual innegociable. Recorte del gasto primario y saneamiento de transferencias discrecionales.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-primary/60 p-4 rounded-2xl border border-gold/20 space-y-1.5 shadow-soft">
          <div className="flex items-center justify-between text-gold text-xs font-bold font-sans uppercase">
            <span className="font-eyebrow text-gold">3. Acumulación Reservas</span>
            <ArrowUpRight size={14} />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Compras de divisas en el Mercado Libre de Cambios (MULC) y liquidaciones del sector agroexportador y energético.
          </p>
        </div>
      </div>
    </Card>
  );
};
