import { IntelligenceNews, NewsCategory, ImpactLevel } from '../domain/IntelligenceNews';

export interface NewsIntelligenceDto {
  breakingNews: IntelligenceNews | null;
  newsList: IntelligenceNews[];
  topAffectedAssets: Array<{ ticker: string; mentionsCount: number; trend: 'up' | 'down' }>;
}

export interface NewsRepositoryPort {
  getNews(category?: NewsCategory, impact?: ImpactLevel): Promise<NewsIntelligenceDto>;
  getNewsById(id: string): Promise<IntelligenceNews | null>;
}
