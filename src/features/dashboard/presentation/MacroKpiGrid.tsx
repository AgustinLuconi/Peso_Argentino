import React from 'react';
import { MacroKpi } from '../domain/MacroKpi';
import { StatKpi } from '@core/ui/components/StatKpi';
import { ShieldCheck, TrendingDown, Layers, Landmark, Scale, DollarSign } from 'lucide-react';

export interface MacroKpiGridProps {
  kpis: MacroKpi[];
}

export const MacroKpiGrid: React.FC<MacroKpiGridProps> = ({ kpis }) => {
  const getIconForKpi = (id: string) => {
    switch (id) {
      case 'reservas-bcra':
        return <Landmark size={16} />;
      case 'riesgo-pais':
        return <TrendingDown size={16} />;
      case 'inflacion-mensual':
        return <ShieldCheck size={16} />;
      case 'tasa-politica':
        return <Layers size={16} />;
      case 'superavit-fiscal':
        return <Scale size={16} />;
      case 'brecha-promedio':
        return <DollarSign size={16} />;
      default:
        return <Landmark size={16} />;
    }
  };

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4">
      {kpis.map((kpi, idx) => (
        <StatKpi
          key={kpi.id}
          label={kpi.title}
          value={kpi.value}
          change={kpi.variation?.value}
          changePeriod={kpi.period}
          sparklineData={kpi.historicalSeries}
          footerText={kpi.statusNote}
          icon={getIconForKpi(kpi.id)}
          accent={idx === 0 ? 'navy' : idx === 1 ? 'gold' : 'none'}
          variant={idx === 0 ? 'navy' : 'default'}
        />
      ))}
    </div>
  );
};
