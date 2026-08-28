import {
  NewsRepositoryPort,
  NewsIntelligenceDto,
} from '../application/NewsRepositoryPort';
import {
  IntelligenceNews,
  NewsCategory,
  ImpactLevel,
} from '../domain/IntelligenceNews';
import { smartCache, CACHE_TTL } from '@core/infrastructure/SmartCacheAdapter';
import { MockNewsRepository } from './MockNewsRepository';
import { API_CONFIG } from '@core/config/api.config';

export class BackendNewsRepository implements NewsRepositoryPort {
  private fallbackRepo = new MockNewsRepository();
  private backendUrl = API_CONFIG.getEndpoint('/api/v1/news/feed');

  async getNews(category?: NewsCategory, impact?: ImpactLevel): Promise<NewsIntelligenceDto> {
    const cacheKey = `news_intelligence_backend_${category || 'all'}_${impact || 'all'}`;

    return await smartCache.getOrFetch<NewsIntelligenceDto>(
      cacheKey,
      async () => {
        try {
          const res = await fetch(this.backendUrl);
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              const rawList = json.data || [];

              const mappedNews = rawList.map(
                (n: any) =>
                  new IntelligenceNews({
                    id: n.id,
                    title: n.title,
                    summary: n.summary,
                    source: n.source,
                    scope: n.scope,
                    category: 'macro',
                    impactLevel: n.impactLevel,
                    publishedAt: n.publishedAt,
                    readTimeMinutes: 3,
                    affectedAssets: n.affectedAssets || [],
                    keyTakeaways: n.keyTakeaways || [],
                    marketSentiment: n.sentiment || 'bullish',
                  })
              );

              const breakingNews = mappedNews[0] || null;
              const newsList = mappedNews.slice(1);

              const topAffectedAssets = [
                { ticker: 'LEFIs', mentionsCount: 14, trend: 'up' as const },
                { ticker: 'AL30', mentionsCount: 12, trend: 'up' as const },
                { ticker: 'GD30', mentionsCount: 9, trend: 'up' as const },
                { ticker: 'Dólar CCL', mentionsCount: 8, trend: 'down' as const },
                { ticker: 'YPF', mentionsCount: 7, trend: 'up' as const },
              ];

              return {
                breakingNews,
                newsList,
                topAffectedAssets,
              };
            }
          }
        } catch (e) {
          console.warn('[BackendNewsRepository] Error connecting to backend:', e);
        }

        return await this.fallbackRepo.getNews(category, impact);
      },
      CACHE_TTL.NEWS_INTELLIGENCE
    );
  }

  async getNewsById(id: string): Promise<IntelligenceNews | null> {
    const all = await this.getNews();
    if (all.breakingNews?.id === id) return all.breakingNews;
    return all.newsList.find((n) => n.id === id) || null;
  }
}
