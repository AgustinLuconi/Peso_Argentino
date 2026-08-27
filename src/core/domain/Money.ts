export type CurrencyCode = 'ARS' | 'USD' | 'EUR' | 'BRL';

export class Money {
  readonly amount: number;
  readonly currency: CurrencyCode;

  constructor(amount: number, currency: CurrencyCode = 'ARS') {
    this.amount = amount;
    this.currency = currency;
  }

  static of(amount: number, currency: CurrencyCode = 'ARS'): Money {
    return new Money(amount, currency);
  }

  static formatArs(amount: number): string {
    return Money.of(amount, 'ARS').format();
  }

  static formatUsd(amount: number): string {
    return Money.of(amount, 'USD').format();
  }

  static fromString(val: string, currency: CurrencyCode = 'ARS'): Money {
    const cleaned = val.replace(/[^0-9.-]+/g, '');
    const num = parseFloat(cleaned);
    return new Money(isNaN(num) ? 0 : num, currency);
  }

  format(options?: { decimals?: number; showCurrency?: boolean; compact?: boolean }): string {
    const decimals = options?.decimals ?? (this.currency === 'ARS' ? 2 : 2);
    const showCurrency = options?.showCurrency ?? true;
    const compact = options?.compact ?? false;

    let formattedNumber: string;

    if (compact && Math.abs(this.amount) >= 1_000_000_000_000) {
      formattedNumber = (this.amount / 1_000_000_000_000).toLocaleString('es-AR', {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
      }) + ' B'; // Billones (trillions)
    } else if (compact && Math.abs(this.amount) >= 1_000_000) {
      formattedNumber = (this.amount / 1_000_000).toLocaleString('es-AR', {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
      }) + ' M'; // Millones
    } else {
      formattedNumber = this.amount.toLocaleString('es-AR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }

    if (!showCurrency) return formattedNumber;

    const symbol = this.currency === 'USD' ? 'US$' : this.currency === 'EUR' ? '€' : '$';
    return `${symbol} ${formattedNumber}`;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot add different currencies: ${this.currency} and ${other.currency}`);
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot subtract different currencies: ${this.currency} and ${other.currency}`);
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }
}
