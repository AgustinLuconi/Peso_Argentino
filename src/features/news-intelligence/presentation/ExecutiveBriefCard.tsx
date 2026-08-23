import React from 'react';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

export const ExecutiveBriefCard: React.FC<{
  topAssets: Array<{ ticker: string; mentionsCount: number; trend: 'up' | 'down' }>;
}> = ({ topAssets }) => {
  return (
    <Card variant="navy" accent="gold" className="text-white space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gold/20 text-gold rounded-xl shrink-0">
            <Sparkles size={18} />
          </div>
          <h3 className="font-h3 text-base sm:text-lg text-white">
            Termómetro de Sentimiento & Activos más Mencionados
          </h3>
        </div>
        <Badge variant="gold" size="sm">
          SÍNTESIS INTELIGENCIA
        </Badge>
      </div>

      <p className="text-xs font-sans text-slate-300 leading-relaxed">
        El flujo de noticias de la jornada refleja un optimismo institucional impulsado por la continuidad de las compras netas de divisas del BCRA y la desaceleración del IPC. Los activos soberanos en dólares (AL30 y GD30) concentran el mayor volumen de cobertura.
      </p>

      {/* Top Assets Pills */}
      <div className="space-y-2 pt-1">
        <span className="font-eyebrow text-slate-400 block">
          Activos bajo mayor atención de analistas:
        </span>
        <div className="flex flex-wrap gap-2">
          {topAssets.map((asset) => (
            <div
              key={asset.ticker}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/70 rounded-xl border border-gold/20 text-xs font-mono-tabular shadow-soft"
            >
              <span className="font-bold text-gold">{asset.ticker}</span>
              <span className="text-[10px] text-slate-300">
                {asset.mentionsCount} notas
              </span>
              {asset.trend === 'up' ? (
                <TrendingUp size={12} className="text-teal-400" />
              ) : (
                <TrendingDown size={12} className="text-red-400" />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
