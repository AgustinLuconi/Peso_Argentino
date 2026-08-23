import React from 'react';
import { RigiProjectSummary } from '../application/PoliticalRepositoryPort';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { Flame, Pickaxe, Zap, Factory } from 'lucide-react';

export const RigiAndReformPillars: React.FC<{
  rigiSummary: RigiProjectSummary[];
  executiveBriefing: string;
}> = ({ rigiSummary, executiveBriefing }) => {
  const getIconForIndex = (index: number) => {
    switch (index) {
      case 0:
        return <Flame size={16} className="text-secondary" />;
      case 1:
        return <Pickaxe size={16} className="text-primary" />;
      case 2:
        return <Zap size={16} className="text-bullish-green" />;
      default:
        return <Factory size={16} className="text-gold" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Executive Briefing */}
      <Card variant="default" accent="none" className="space-y-3.5 lg:col-span-1">
        <div className="flex items-center justify-between border-b border-surface-container-highest pb-2.5">
          <h3 className="font-h3 text-sm sm:text-base text-primary">
            Síntesis de Inteligencia Política
          </h3>
          <Badge variant="gold" size="sm">
            PERSPECTIVA
          </Badge>
        </div>
        <p className="text-xs font-sans text-on-surface-variant leading-relaxed">
          {executiveBriefing}
        </p>
        <div className="pt-2 border-t border-surface-container-highest text-[11px] font-sans text-outline">
          Factores monitoreados: Gobernabilidad federal, relación con mandatarios provinciales y seguridad jurídica de contratos.
        </div>
      </Card>

      {/* RIGI Pipeline */}
      <Card variant="default" accent="gold" className="space-y-3.5 lg:col-span-2">
        <div className="flex items-center justify-between border-b border-surface-container-highest pb-2.5">
          <h3 className="font-h3 text-sm sm:text-base text-primary">
            Radar RIGI: Inversiones Estratégicas en Evaluación
          </h3>
          <Badge variant="navy" size="sm">
            RÉGIMEN LEY 27.742
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {rigiSummary.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-surface-container-low rounded-2xl border border-surface-container-high space-y-1.5 hover:-translate-y-1 transition-all duration-200 shadow-soft"
            >
              <div className="flex items-center gap-2">
                {getIconForIndex(idx)}
                <span className="font-sans font-bold text-xs text-primary truncate">
                  {item.sector}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="font-mono-tabular font-bold text-base text-primary">
                  US$ {(item.totalInvestmentUsd / 1_000_000_000).toFixed(1)} B
                </span>
                <span className="text-[10px] font-mono text-outline">
                  {item.approvedProjects} proyectos
                </span>
              </div>
              <span className="text-[11px] font-sans text-on-surface-variant block">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
