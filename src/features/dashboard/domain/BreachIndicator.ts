import { Percentage } from '@core/domain/Percentage';

export class BreachIndicator {
  readonly oficialSell: number;
  readonly targetSell: number;
  readonly targetName: string;

  constructor(oficialSell: number, targetSell: number, targetName: string) {
    this.oficialSell = oficialSell;
    this.targetSell = targetSell;
    this.targetName = targetName;
  }

  get breachAmount(): number {
    return this.targetSell - this.oficialSell;
  }

  get breachPercentage(): Percentage {
    if (this.oficialSell === 0) return Percentage.of(0);
    const ratio = (this.targetSell - this.oficialSell) / this.oficialSell;
    return Percentage.fromRatio(ratio);
  }
}
