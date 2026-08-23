import { InstitutionalStatsRepositoryPort, InstitutionalStatsDto } from './InstitutionalStatsRepositoryPort';

export class GetInstitutionalStatsUseCase {
  constructor(private readonly repository: InstitutionalStatsRepositoryPort) {}

  async execute(): Promise<InstitutionalStatsDto> {
    return await this.repository.getInstitutionalStats();
  }
}
