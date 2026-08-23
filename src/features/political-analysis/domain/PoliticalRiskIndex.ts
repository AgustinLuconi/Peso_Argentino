export interface PoliticalRiskScores {
  governabilityScore: number; // 0 to 100
  congressionalSupport: number; // 0 to 100
  regulatoryPredictability: number; // 0 to 100
  fiscalDisciplineCredibility: number; // 0 to 100
  publicOpinionSupport: number; // 0 to 100
  compositeIndex: number;
}

export class PoliticalRiskIndex {
  readonly scores: PoliticalRiskScores;
  readonly lastEvaluated: string;
  readonly institutionalTrend: 'improving' | 'stable' | 'deteriorating';

  constructor(
    scores: PoliticalRiskScores,
    lastEvaluated: string,
    institutionalTrend: 'improving' | 'stable' | 'deteriorating' = 'improving'
  ) {
    this.scores = scores;
    this.lastEvaluated = lastEvaluated;
    this.institutionalTrend = institutionalTrend;
  }
}
