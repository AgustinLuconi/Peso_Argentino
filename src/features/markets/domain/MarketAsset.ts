import { Money } from '@core/domain/Money';
import { Percentage } from '@core/domain/Percentage';

export type AssetCategory =
  | 'panel-lider'
  | 'panel-general'
  | 'adrs'
  | 'cedears'
  | 'bonos-usd'
  | 'bonos-pesos'
  | 'bonos-extranjeros'
  | 'commodities'
  | 'cripto-divisas'
  | 'merval'
  | 'bonds'
  | 'lecaps';

export interface MarketAssetProps {
  ticker: string;
  name: string;
  category: AssetCategory;
  lastPrice: number;
  currency: 'ARS' | 'USD';
  variation24h: number;
  variationMonth?: number;
  variationYear?: number;
  volume24h: number; // in Millions or absolute
  marketCap?: number;
  sparkline?: number[];
  sector?: string;
  maturityDate?: string;
  tir?: number;
  paridad?: number;
  modifiedDurationYears?: number;
  couponPercent?: number;
  legislation?: 'ARGENTINA' | 'NEW_YORK' | 'GLOBAL';
  tna?: number;
  tem?: number;
  rsi14?: number;
  trend?: 'bullish' | 'neutral' | 'bearish';
  technicalSignal?: string;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
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
  readonly modifiedDurationYears?: number;
  readonly couponPercent?: number;
  readonly legislation?: 'ARGENTINA' | 'NEW_YORK' | 'GLOBAL';
  readonly tna?: number;
  readonly tem?: number;
  readonly rsi14?: number;
  readonly trend?: 'bullish' | 'neutral' | 'bearish';
  readonly technicalSignal?: string;
  readonly fiftyTwoWeekHigh?: number;
  readonly fiftyTwoWeekLow?: number;

  constructor(props: MarketAssetProps) {
    this.ticker = props.ticker;
    this.name = props.name;
    this.category = props.category;
    this.lastPrice = Money.of(props.lastPrice, props.currency);
    this.variation24h = Percentage.of(props.variation24h);
    this.variationMonth = Percentage.of(props.variationMonth ?? 0);
    this.variationYear = Percentage.of(props.variationYear ?? 0);
    this.volume24h = Money.of(props.volume24h, props.currency);
    this.marketCap = props.marketCap ? Money.of(props.marketCap, props.currency) : undefined;
    this.sparkline = props.sparkline ?? [];
    this.sector = props.sector;
    this.maturityDate = props.maturityDate;
    this.tir = props.tir !== undefined ? Percentage.of(props.tir) : undefined;
    this.paridad = props.paridad !== undefined ? Percentage.of(props.paridad) : undefined;
    this.modifiedDurationYears = props.modifiedDurationYears;
    this.couponPercent = props.couponPercent;
    this.legislation = props.legislation;
    this.tna = props.tna;
    this.tem = props.tem;
    this.rsi14 = props.rsi14;
    this.trend = props.trend;
    this.technicalSignal = props.technicalSignal;
    this.fiftyTwoWeekHigh = props.fiftyTwoWeekHigh;
    this.fiftyTwoWeekLow = props.fiftyTwoWeekLow;
  }
}
