import { BondDetail } from '../domain/BondDetail';

export interface BondRepositoryPort {
  getBondByTicker(ticker: string): Promise<BondDetail | null>;
  getAllAvailableBonds(): Promise<Array<{ ticker: string; name: string }>>;
}
