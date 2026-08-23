import { NewsRepositoryPort, NewsIntelligenceDto } from './NewsRepositoryPort';
import { NewsCategory, ImpactLevel } from '../domain/IntelligenceNews';

export class GetImpactNewsUseCase {
  constructor(private readonly repository: NewsRepositoryPort) {}

  async execute(category?: NewsCategory, impact?: ImpactLevel): Promise<NewsIntelligenceDto> {
    return await this.repository.getNews(category, impact);
  }
}
