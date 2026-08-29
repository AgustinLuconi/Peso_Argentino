import React, { useState } from 'react';
import { LegislativeItem } from '../domain/LegislativeItem';
import { Badge } from '@core/ui/components/Badge';
import { FileText, ChevronDown, ShieldCheck, Landmark } from 'lucide-react';

export const LegislativeTrackerTable: React.FC<{
  items: LegislativeItem[];
  onSelectItem?: (item: LegislativeItem) => void;
}> = ({ items, onSelectItem }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getDetailedLawInfo = (item: LegislativeItem) => {
    switch (item.code) {
      case 'Ley 27.742':
        return {
          title: 'Ley de Bases y Puntos de Partida para la Libertad de los Argentinos',
          chapters: 'RIGI (Régimen de Incentivo para Grandes Inversiones), Reforma del Estado, Emergencia Administrativa, Privatizaciones y Modernización Laboral.',
          votes: 'Diputados: 147 afirmativos, 107 negativos · Senado: 37 afirmativos (desempate Vicepresidencia), 36 negativos.',
          fiscalImpact: '+0,5% PBI estimado a través de atracción de capitales estratégicos y reducción de gasto de estructura pública.',
          regulatoryDecree: 'Decreto Reglamentario 749/2024 (Capítulo RIGI)',
        };
      case 'Ley 27.743':
        return {
          title: 'Medidas Fiscales Paliativas y Relevantes (Paquete Fiscal)',
          chapters: 'Régimen de Regularización de Activos (Blanqueo), Moratoria Impositiva, Modificación de Bienes Personales y Restitución de Ganancias (4ta categoría).',
          votes: 'Diputados: 144 afirmativos, 108 negativos · Senado: 38 afirmativos, 35 negativos.',
          fiscalImpact: '+0,4% PBI proyectado por recaudación extraordinaria de blanqueo y adelanto de Bienes Personales (REIBP).',
          regulatoryDecree: 'Decreto Reglamentario 608/2024',
        };
      case 'DNU 70/2023':
        return {
          title: 'Bases para la Reconstrucción de la Economía Argentina (DNU Desregulador)',
          chapters: 'Derogación de Ley de Alquileres, Ley de Abastecimiento, desregulación aerocomercial (Cielos Abiertos), reforma societaria (S.A. Deportivas) y comercio exterior.',
          votes: 'Senado: Rechazado (42 a 25) · Cámara de Diputados: Vigente según Ley 26.122 (sin tratamiento en el pleno).',
          fiscalImpact: 'Aumento de eficiencia en asignación de recursos y reducción de costos transaccionales privados.',
          regulatoryDecree: 'En plena vigencia operativa por imperio del artículo 17 de la Ley 26.122',
        };
      default:
        return {
          title: item.title,
          chapters: item.impactSector,
          votes: 'Trámite parlamentario ordinario',
          fiscalImpact: 'Impacto en análisis según comisiones',
          regulatoryDecree: 'En proceso de reglamentación ministerial',
        };
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-surface-container text-primary rounded-xl shrink-0">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="font-h3 text-base text-primary">
              Monitor Legislativo: Leyes, Decretos & Reformas Estructurales
            </h3>
            <p className="font-subtitle text-xs">
              Haz clic en cualquier norma para desplegar su estado parlamentario, capítulos y decretos
            </p>
          </div>
        </div>
        <span className="font-eyebrow text-outline hidden sm:inline">
          Congreso Nacional & P.E.N.
        </span>
      </div>

      {/* Expandable Accordion List */}
      <div className="space-y-3">
        {items.map((item) => {
          const isExpanded = expandedId === item.id;
          const details = getDetailedLawInfo(item);

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white dark:bg-[#0F141C] ${
                isExpanded
                  ? 'border-emerald-500/50 shadow-tactile'
                  : 'border-surface-container-highest dark:border-[#1E2638] hover:border-emerald-500/30 shadow-soft hover:-translate-y-0.5'
              }`}
            >
              {/* Accordion Header Row */}
              <div
                onClick={() => {
                  toggleExpand(item.id);
                  if (onSelectItem) onSelectItem(item);
                }}
                className="p-4 cursor-pointer flex items-center justify-between gap-4 select-none hover:bg-surface-container-low/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono-tabular font-bold text-xs text-primary px-2.5 py-1 bg-surface-container rounded-xl shrink-0">
                    {item.code}
                  </span>
                  <Badge variant={item.status === 'promulgada' || item.status === 'ratificada' ? 'bullish' : 'gold'} size="sm">
                    {item.status.toUpperCase()}
                  </Badge>
                  <span className="font-sans font-bold text-xs sm:text-sm text-on-surface truncate">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={item.economicImpact === 'Muy Alto' ? 'navy' : 'neutral'} size="sm" className="hidden sm:inline-flex">
                    {item.economicImpact} Impacto
                  </Badge>
                  <span className="font-mono-tabular text-xs text-outline hidden md:inline">
                    {item.date}
                  </span>
                  <div className={`p-1 rounded-full text-outline transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isExpanded ? 'rotate-180 bg-surface-container text-primary' : ''}`}>
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Fluid Expandable Content Tray */}
              <div
                className={`accordion-content-wrapper ${
                  isExpanded ? 'is-open' : ''
                }`}
              >
                <div className="accordion-content-inner">
                  <div className="px-4 pb-4 pt-2 border-t border-surface-container-high dark:border-[#1a2744] bg-surface-container-low/40 dark:bg-[#0c1730] text-xs font-sans space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-white dark:bg-[#101e3d] rounded-2xl border border-surface-container-highest dark:border-[#1a2744] space-y-1 shadow-soft">
                        <span className="font-eyebrow text-primary block">
                          Capítulos y Ejes Principales:
                        </span>
                        <p className="text-on-surface text-xs leading-relaxed">
                          {details.chapters}
                        </p>
                      </div>

                      <div className="p-3.5 bg-white dark:bg-[#101e3d] rounded-2xl border border-surface-container-highest dark:border-[#1a2744] space-y-1 shadow-soft">
                        <span className="font-eyebrow text-primary block">
                          Votación Parlamentaria:
                        </span>
                        <p className="text-on-surface text-xs leading-relaxed">
                          {details.votes}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-surface-container-high dark:border-[#1a2744] text-[11px]">
                      <div className="flex items-center gap-1.5 text-bullish-green font-semibold">
                        <ShieldCheck size={14} />
                        <span>{details.regulatoryDecree}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-secondary font-medium">
                        <Landmark size={14} />
                        <span>Impacto Fiscal: {details.fiscalImpact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
