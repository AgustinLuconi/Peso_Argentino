import { BondRepositoryPort } from './BondRepositoryPort';
import { BondDetail } from '../domain/BondDetail';

export class GetBondDetailUseCase {
  constructor(private readonly repository: BondRepositoryPort) {}

  async execute(ticker: string = 'AL30'): Promise<BondDetail | null> {
    return await this.repository.getBondByTicker(ticker);
  }
}
