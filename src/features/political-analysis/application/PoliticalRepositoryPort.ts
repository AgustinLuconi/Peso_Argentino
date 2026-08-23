import { PoliticalRiskIndex } from '../domain/PoliticalRiskIndex';
import { LegislativeItem } from '../domain/LegislativeItem';

export interface RigiProjectSummary {
  sector: string;
  totalInvestmentUsd: number;
  approvedProjects: number;
  status: string;
}

export interface PoliticalAnalysisDto {
  riskIndex: PoliticalRiskIndex;
  legislativeItems: LegislativeItem[];
  rigiSummary: RigiProjectSummary[];
  executiveBriefing: string;
}

export interface PoliticalRepositoryPort {
  getPoliticalAnalysis(): Promise<PoliticalAnalysisDto>;
}
