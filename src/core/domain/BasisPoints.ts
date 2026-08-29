/**
 * Value Object for Basis Points (bps)
 * Used for Sovereign Risk (Riesgo País EMBI+), Spreads, and Yield differentials.
 */
export class BasisPoints {
  readonly value: number;

  constructor(value: number) {
    this.value = Math.round(value);
  }

  static of(value: number): BasisPoints {
    return new BasisPoints(value);
  }

  static fromPercentage(percentage: number): BasisPoints {
    return new BasisPoints(percentage * 100);
  }

  toPercentage(): number {
    return this.value / 100;
  }

  format(options?: { showUnit?: boolean }): string {
    const showUnit = options?.showUnit ?? true;
    const formatted = this.value.toLocaleString('es-AR');
    return showUnit ? `${formatted} bps` : formatted;
  }
}
