export type CurrencyCode = 'ARS' | 'USD' | 'EUR' | 'BRL';

export interface MoneyFormatOptions {
  decimals?: number;
  showCurrency?: boolean;
  compact?: boolean;
  scaleDetail?: boolean; // Muestra 'Billones', 'Millones', 'Miles' de forma explícita
  notation?: 'standard' | 'compact' | 'extended';
}

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

  static formatArs(amount: number, options?: MoneyFormatOptions): string {
    return Money.of(amount, 'ARS').format(options);
  }

  static formatUsd(amount: number, options?: MoneyFormatOptions): string {
    return Money.of(amount, 'USD').format(options);
  }

  static fromString(val: string, currency: CurrencyCode = 'ARS'): Money {
    const cleaned = val.replace(/[^0-9.-]+/g, '');
    const num = parseFloat(cleaned);
    return new Money(isNaN(num) ? 0 : num, currency);
  }

  /**
   * Formatea el monto con especificación clara de escala:
   * - Billones (10^12): ej. "$ 25,4 Billones"
   * - Miles de Millones (10^9): ej. "US$ 14.500 Millones"
   * - Millones (10^6): ej. "US$ 30.400 M"
   * - Miles (10^3): ej. "$ 500 Mil"
   */
  static formatScale(amount: number, currency: CurrencyCode = 'ARS'): {
    formatted: string;
    scaleLabel: 'Billones' | 'Miles de Millones' | 'Millones' | 'Miles' | 'Unidades';
    compactValue: string;
    fullFormatted: string;
  } {
    const abs = Math.abs(amount);
    const symbol = currency === 'USD' ? 'US$' : currency === 'EUR' ? '€' : '$';

    const fullFormatted = `${symbol} ${amount.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    if (abs >= 1_000_000_000_000) {
      // 1 Billón en español = 10^12 (Trillion en inglés)
      const val = amount / 1_000_000_000_000;
      const compactVal = `${val.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} Billones`;
      return {
        formatted: `${symbol} ${compactVal}`,
        scaleLabel: 'Billones',
        compactValue: compactVal,
        fullFormatted,
      };
    }

    if (abs >= 1_000_000_000) {
      // 1 Mil Millones en español = 10^9 (Billion en inglés)
      const val = amount / 1_000_000_000;
      const compactVal = `${val.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} Mil M`;
      return {
        formatted: `${symbol} ${compactVal}`,
        scaleLabel: 'Miles de Millones',
        compactValue: compactVal,
        fullFormatted,
      };
    }

    if (abs >= 1_000_000) {
      // Millones = 10^6
      const val = amount / 1_000_000;
      const compactVal = `${val.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} M`;
      return {
        formatted: `${symbol} ${compactVal}`,
        scaleLabel: 'Millones',
        compactValue: compactVal,
        fullFormatted,
      };
    }

    if (abs >= 1_000) {
      // Miles = 10^3
      const val = amount / 1_000;
      const compactVal = `${val.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} Mil`;
      return {
        formatted: `${symbol} ${compactVal}`,
        scaleLabel: 'Miles',
        compactValue: compactVal,
        fullFormatted,
      };
    }

    return {
      formatted: fullFormatted,
      scaleLabel: 'Unidades',
      compactValue: `${amount.toLocaleString('es-AR')}`,
      fullFormatted,
    };
  }

  /**
   * Conversión bidireccional entre Pesos y Dólares con tasa de cambio
   */
  static convert(amount: number, from: CurrencyCode, to: CurrencyCode, exchangeRate: number): Money {
    if (from === to || exchangeRate <= 0) return new Money(amount, to);

    if (from === 'ARS' && to === 'USD') {
      return new Money(amount / exchangeRate, 'USD');
    }
    if (from === 'USD' && to === 'ARS') {
      return new Money(amount * exchangeRate, 'ARS');
    }

    return new Money(amount, to);
  }

  format(options?: MoneyFormatOptions): string {
    const decimals = options?.decimals ?? 2;
    const showCurrency = options?.showCurrency ?? true;
    const compact = options?.compact ?? false;

    if (compact || options?.scaleDetail) {
      const scale = Money.formatScale(this.amount, this.currency);
      return showCurrency ? scale.formatted : scale.compactValue;
    }

    const formattedNumber = this.amount.toLocaleString('es-AR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

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
