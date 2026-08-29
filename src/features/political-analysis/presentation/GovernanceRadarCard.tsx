import React from 'react';
import { PoliticalRiskIndex } from '../domain/PoliticalRiskIndex';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { Scale, CheckCircle2 } from 'lucide-react';

export const GovernanceRadarCard: React.FC<{ riskIndex: PoliticalRiskIndex }> = ({
  riskIndex,
}) => {
  const scores = riskIndex.scores;

  const metrics = [
    { label: 'Disciplina & Ancla Fiscal', val: scores.fiscalDisciplineCredibility, color: 'bullish' },
    { label: 'Previsibilidad Regulatoria', val: scores.regulatoryPredictability, color: 'gold' },
    { label: 'Índice de Gobernabilidad', val: scores.governabilityScore, color: 'gold' },
    { label: 'Cohesión en el Congreso', val: scores.congressionalSupport, color: 'neutral' },
    { label: 'Aprobación / Opinión Pública', val: scores.publicOpinionSupport, color: 'neutral' },
  ];

  return (
    <Card variant="navy" accent="gold" className="text-white space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gold/20 text-gold rounded-xl shrink-0">
            <Scale size={18} />
          </div>
          <div>
            <h3 className="font-h3 text-base sm:text-lg text-white">
              Radar de Riesgo Político e Institucional
            </h3>
            <p className="font-subtitle text-xs text-slate-300">
              Evaluación cuantitativa de credibilidad fiscal, cohesión legislativa y clima regulatorio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">
            SCORE GLOBAL: {scores.compositeIndex} / 100
          </Badge>
          <Badge variant="bullish" size="sm">
            TENDENCIA POSITIVA
          </Badge>
        </div>
      </div>

      {/* Progress Bars Metric Grid (2 balanced rows) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="p-3.5 bg-primary/60 rounded-2xl border border-gold/20 flex flex-col justify-between space-y-2.5 shadow-soft"
          >
            <div>
              <span className="font-eyebrow text-slate-300 block mb-1">
                {m.label}
              </span>
              <span className="text-xl font-mono-tabular font-bold text-gold">
                {m.val}%
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-2 bg-surface-container-highest/40 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-gold to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${m.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
