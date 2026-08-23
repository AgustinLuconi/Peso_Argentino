import { Money } from '@core/domain/Money';
import { Percentage } from '@core/domain/Percentage';

export interface CashFlowItem {
  paymentDate: string;
  interestRate: number; // e.g. 0.75%
  interestAmountUsd: number;
  amortizationPercent: number;
  amortizationAmountUsd: number;
  totalCashFlowUsd: number;
  remainingCapitalPercent: number;
  status: 'paid' | 'upcoming' | 'future';
}

export interface BondDetailProps {
  ticker: string;
  isin: string;
  name: string;
  issuer: string;
  law: string;
  issueDate: string;
  maturityDate: string;
  priceArs: number;
  priceMep: number;
  priceCable: number;
  parity: number;
  tir: number;
  modifiedDuration: number;
  couponRate: number;
  technicalValue: number;
  accruedInterest: number;
  cashFlows: CashFlowItem[];
}

export class BondDetail {
  readonly ticker: string;
  readonly isin: string;
  readonly name: string;
  readonly issuer: string;
  readonly law: string;
  readonly issueDate: string;
  readonly maturityDate: string;
  readonly priceArs: Money;
  readonly priceMep: Money;
  readonly priceCable: Money;
  readonly parity: Percentage;
  readonly tir: Percentage;
  readonly modifiedDuration: number;
  readonly couponRate: Percentage;
  readonly technicalValue: Money;
  readonly accruedInterest: Money;
  readonly cashFlows: CashFlowItem[];

  constructor(props: BondDetailProps) {
    this.ticker = props.ticker;
    this.isin = props.isin;
    this.name = props.name;
    this.issuer = props.issuer;
    this.law = props.law;
    this.issueDate = props.issueDate;
    this.maturityDate = props.maturityDate;
    this.priceArs = Money.of(props.priceArs, 'ARS');
    this.priceMep = Money.of(props.priceMep, 'USD');
    this.priceCable = Money.of(props.priceCable, 'USD');
    this.parity = Percentage.of(props.parity);
    this.tir = Percentage.of(props.tir);
    this.modifiedDuration = props.modifiedDuration;
    this.couponRate = Percentage.of(props.couponRate);
    this.technicalValue = Money.of(props.technicalValue, 'USD');
    this.accruedInterest = Money.of(props.accruedInterest, 'USD');
    this.cashFlows = props.cashFlows;
  }

  get implicitMepDollar(): number {
    if (this.priceMep.amount === 0) return 0;
    return this.priceArs.amount / this.priceMep.amount;
  }

  get implicitCclDollar(): number {
    if (this.priceCable.amount === 0) return 0;
    return this.priceArs.amount / this.priceCable.amount;
  }

  get canjeRatio(): Percentage {
    if (this.priceMep.amount === 0) return Percentage.of(0);
    return Percentage.fromRatio((this.priceCable.amount - this.priceMep.amount) / this.priceMep.amount);
  }
}
