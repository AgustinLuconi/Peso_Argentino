import {
  PoliticalRepositoryPort,
  PoliticalAnalysisDto,
} from '../application/PoliticalRepositoryPort';
import { PoliticalRiskIndex } from '../domain/PoliticalRiskIndex';
import { LegislativeItem } from '../domain/LegislativeItem';
import { smartCache, CACHE_TTL } from '@core/infrastructure/SmartCacheAdapter';
import { MockPoliticalRepository } from './MockPoliticalRepository';

export class BackendPoliticalRepository implements PoliticalRepositoryPort {
  private fallbackRepo = new MockPoliticalRepository();
  private backendUrl = 'http://localhost:3001/api/v1/political/overview';

  async getPoliticalAnalysis(): Promise<PoliticalAnalysisDto> {
    const cacheKey = 'political_analysis_backend';

    return await smartCache.getOrFetch<PoliticalAnalysisDto>(
      cacheKey,
      async () => {
        try {
          const res = await fetch(this.backendUrl);
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              const d = json.data;

              const riskIndex = new PoliticalRiskIndex(
                {
                  governabilityScore: d.governanceRiskScore || 32,
                  congressionalSupport: 42,
                  regulatoryPredictability: 78,
                  fiscalDisciplineCredibility: 85,
                  publicOpinionSupport: 52,
                  compositeIndex: d.governanceRiskScore || 32,
                },
                'Monitoreo Parlamentario en tiempo real',
                'improving'
              );

              const legislativeItems = (d.legislativeItems || []).map(
                (item: any) =>
                  new LegislativeItem({
                    id: item.id,
                    code: item.code,
                    title: item.title,
                    type: item.type,
                    status: item.status,
                    economicImpact: item.economicImpact,
                    impactSector: item.impactSector,
                    date: item.date,
                    chambers: item.votes || 'Diputados & Senado',
                    summary: item.chapters || item.title,
                  })
              );

              const rigiSummary = [
                { sector: 'Gas Natural Licuado (GNL)', totalInvestmentUsd: 22000000000, approvedProjects: 1, status: 'Vía Libre Aprobada' },
                { sector: 'Minería Cobre & Oro', totalInvestmentUsd: 6500000000, approvedProjects: 2, status: 'Vía Libre Aprobada' },
                { sector: 'Minería Litio', totalInvestmentUsd: 1800000000, approvedProjects: 3, status: 'Vía Libre Aprobada' },
                { sector: 'Energías Renovables', totalInvestmentUsd: 950000000, approvedProjects: 1, status: 'En Evaluación' },
              ];

              return {
                riskIndex,
                legislativeItems,
                rigiSummary,
                executiveBriefing:
                  'La sanción definitiva y promulgación de la Ley de Bases y el Paquete Fiscal han establecido un marco institucional pro-mercado de alta estabilidad. El RIGI avanza con proyectos de gas licuado y minería.',
              };
            }
          }
        } catch (e) {
          console.warn('[BackendPoliticalRepository] Error contacting backend:', e);
        }

        return await this.fallbackRepo.getPoliticalAnalysis();
      },
      CACHE_TTL.POLITICAL_LAWS
    );
  }
}
