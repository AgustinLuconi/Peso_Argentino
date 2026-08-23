import {
  MarketRepositoryPort,
  MarketAssetsDto,
  MarketIndexData,
} from '../application/MarketRepositoryPort';
import { MarketAsset, AssetCategory } from '../domain/MarketAsset';
import { smartCache, CACHE_TTL } from '@core/infrastructure/SmartCacheAdapter';
import { MockMarketRepository } from './MockMarketRepository';

export class BackendMarketRepository implements MarketRepositoryPort {
  private fallbackRepo = new MockMarketRepository();
  private backendUrl = 'http://localhost:3001/api/v1/markets/assets';

  async getMarketData(category?: AssetCategory): Promise<MarketAssetsDto> {
    const cacheKey = `markets_data_backend_${category || 'all'}`;

    return await smartCache.getOrFetch<MarketAssetsDto>(
      cacheKey,
      async () => {
        try {
          const res = await fetch(this.backendUrl);
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              const rawIndices = json.data.indices || [];
              const rawAssets = json.data.assets || [];

              const indices: MarketIndexData[] = rawIndices.map((i: any) => ({
                name: i.name,
                value: i.value,
                currency: i.currency.includes('USD') ? 'USD' : 'ARS',
                variation24h: i.variation24h,
                volumeTotal: 34500000000,
              }));

              let mappedAssets: MarketAsset[] = rawAssets.map(
                (a: any) =>
                  new MarketAsset({
                    ticker: a.ticker,
                    name: a.name,
                    category: a.category as AssetCategory,
                    lastPrice: a.price,
                    currency: a.currency,
                    variation24h: a.variation24h,
                    variationMonth: a.variation24h * 1.5,
                    variationYear: a.variation24h * 12.0,
                    volume24h: a.volume24h,
                    sparkline: [a.price * 0.98, a.price * 0.99, a.price],
                    tir: a.tirPercent,
                    paridad: a.parityPercent,
                    maturityDate: a.maturityDate,
                  })
              );

              if (category) {
                mappedAssets = mappedAssets.filter((a) => a.category === category);
              }

              return { indices, assets: mappedAssets };
            }
          }
        } catch (e) {
          console.warn('[BackendMarketRepository] Error calling backend, falling back to mock:', e);
        }

        return await this.fallbackRepo.getMarketData(category);
      },
      CACHE_TTL.MARKET_ASSETS
    );
  }

  async getAssetByTicker(ticker: string): Promise<MarketAsset | null> {
    const all = await this.getMarketData();
    return all.assets.find((a) => a.ticker.toLowerCase() === ticker.toLowerCase()) || null;
  }
}
