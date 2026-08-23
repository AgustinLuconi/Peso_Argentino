import { Money } from '@core/domain/Money';
import { Percentage } from '@core/domain/Percentage';

export type DollarType =
  | 'oficial'
  | 'blue'
  | 'mep'
  | 'ccl'
  | 'tarjeta'
  | 'mayorista'
  | 'cripto';

export interface MarketQuoteProps {
  type: DollarType;
  name: string;
  buyPrice: number;
  sellPrice: number;
  variation24h: number;
  historicalSparkline: number[];
  updatedAt: string;
  spreadPercentage?: number;
}

export class MarketQuote {
  readonly type: DollarType;
  readonly name: string;
  readonly buyPrice: Money;
  readonly sellPrice: Money;
  readonly variation24h: Percentage;
  readonly historicalSparkline: number[];
  readonly updatedAt: string;

  constructor(props: MarketQuoteProps) {
    this.type = props.type;
    this.name = props.name;
    this.buyPrice = Money.of(props.buyPrice, 'ARS');
    this.sellPrice = Money.of(props.sellPrice, 'ARS');
    this.variation24h = Percentage.of(props.variation24h);
    this.historicalSparkline = props.historicalSparkline;
    this.updatedAt = props.updatedAt;
  }

  get spread(): Money {
    return this.sellPrice.subtract(this.buyPrice);
  }

  get spreadPercent(): Percentage {
    if (this.buyPrice.amount === 0) return Percentage.of(0);
    return Percentage.fromRatio(this.spread.amount / this.buyPrice.amount);
  }
}
