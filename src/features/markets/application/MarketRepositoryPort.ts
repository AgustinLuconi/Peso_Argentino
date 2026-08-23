import { MarketAsset, AssetCategory } from '../domain/MarketAsset';

export interface MarketIndexData {
  name: string;
  value: number;
  currency: 'ARS' | 'USD';
  variation24h: number;
  volumeTotal: number;
}

export interface MarketAssetsDto {
  indices: MarketIndexData[];
  assets: MarketAsset[];
}

export interface MarketRepositoryPort {
  getMarketData(category?: AssetCategory): Promise<MarketAssetsDto>;
  getAssetByTicker(ticker: string): Promise<MarketAsset | null>;
}
