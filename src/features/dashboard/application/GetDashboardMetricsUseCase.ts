import { DashboardRepositoryPort, DashboardMetricsDto } from './DashboardRepositoryPort';

export class GetDashboardMetricsUseCase {
  constructor(private readonly repository: DashboardRepositoryPort) {}

  async execute(): Promise<DashboardMetricsDto> {
    return await this.repository.getDashboardMetrics();
  }
}
