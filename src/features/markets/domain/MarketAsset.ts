import { Money } from '@core/domain/Money';
import { Percentage } from '@core/domain/Percentage';

export type AssetCategory = 'merval' | 'adrs' | 'bonds' | 'lecaps' | 'cedears';

export interface MarketAssetProps {
  ticker: string;
  name: string;
  category: AssetCategory;
  lastPrice: number;
  currency: 'ARS' | 'USD';
  variation24h: number;
  variationMonth: number;
  variationYear: number;
  volume24h: number; // in Millions
  marketCap?: number;
  sparkline: number[];
  sector?: string;
  maturityDate?: string;
  tir?: number;
  paridad?: number;
}

export class MarketAsset {
  readonly ticker: string;
  readonly name: string;
  readonly category: AssetCategory;
  readonly lastPrice: Money;
  readonly variation24h: Percentage;
  readonly variationMonth: Percentage;
  readonly variationYear: Percentage;
  readonly volume24h: Money;
  readonly marketCap?: Money;
  readonly sparkline: number[];
  readonly sector?: string;
  readonly maturityDate?: string;
  readonly tir?: Percentage;
  readonly paridad?: Percentage;

  constructor(props: MarketAssetProps) {
    this.ticker = props.ticker;
    this.name = props.name;
    this.category = props.category;
    this.lastPrice = Money.of(props.lastPrice, props.currency);
    this.variation24h = Percentage.of(props.variation24h);
    this.variationMonth = Percentage.of(props.variationMonth);
    this.variationYear = Percentage.of(props.variationYear);
    this.volume24h = Money.of(props.volume24h, props.currency);
    this.marketCap = props.marketCap ? Money.of(props.marketCap, props.currency) : undefined;
    this.sparkline = props.sparkline;
    this.sector = props.sector;
    this.maturityDate = props.maturityDate;
    this.tir = props.tir !== undefined ? Percentage.of(props.tir) : undefined;
    this.paridad = props.paridad !== undefined ? Percentage.of(props.paridad) : undefined;
  }
}
