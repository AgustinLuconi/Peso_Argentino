export class Percentage {
  readonly value: number; // e.g. 5.25 for +5.25%

  constructor(value: number) {
    this.value = value;
  }

  static of(value: number): Percentage {
    return new Percentage(value);
  }

  static fromRatio(ratio: number): Percentage {
    return new Percentage(ratio * 100);
  }

  isPositive(): boolean {
    return this.value > 0;
  }

  isNegative(): boolean {
    return this.value < 0;
  }

  isNeutral(): boolean {
    return Math.abs(this.value) < 0.0001;
  }

  format(options?: { showSign?: boolean; decimals?: number }): string {
    const showSign = options?.showSign ?? true;
    const decimals = options?.decimals ?? 2;

    const formatted = Math.abs(this.value).toLocaleString('es-AR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    if (this.isPositive() && showSign) {
      return `+${formatted}%`;
    }
    if (this.isNegative() && showSign) {
      return `-${formatted}%`;
    }
    return `${formatted}%`;
  }
}
