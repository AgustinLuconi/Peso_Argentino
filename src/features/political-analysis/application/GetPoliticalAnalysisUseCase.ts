import { PoliticalRepositoryPort, PoliticalAnalysisDto } from './PoliticalRepositoryPort';

export class GetPoliticalAnalysisUseCase {
  constructor(private readonly repository: PoliticalRepositoryPort) {}

  async execute(): Promise<PoliticalAnalysisDto> {
    return await this.repository.getPoliticalAnalysis();
  }
}
