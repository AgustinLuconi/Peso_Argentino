import { MarketRepositoryPort, MarketAssetsDto } from './MarketRepositoryPort';
import { AssetCategory } from '../domain/MarketAsset';

export class GetMarketAssetsUseCase {
  constructor(private readonly repository: MarketRepositoryPort) {}

  async execute(category?: AssetCategory): Promise<MarketAssetsDto> {
    return await this.repository.getMarketData(category);
  }
}
