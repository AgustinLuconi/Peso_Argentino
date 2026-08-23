export interface DataPoint {
  timestamp: string; // ISO or date label (e.g. '2026-08', '14:30', 'Lun')
  value: number;
  secondaryValue?: number;
  label?: string;
}

export class TimeSeries {
  readonly name: string;
  readonly unit: string;
  readonly points: DataPoint[];

  constructor(name: string, unit: string, points: DataPoint[]) {
    this.name = name;
    this.unit = unit;
    this.points = points;
  }

  get latestValue(): number | undefined {
    return this.points.length > 0 ? this.points[this.points.length - 1].value : undefined;
  }

  get startValue(): number | undefined {
    return this.points.length > 0 ? this.points[0].value : undefined;
  }

  get changePercentage(): number {
    if (this.points.length < 2 || !this.startValue || this.startValue === 0) return 0;
    const end = this.latestValue ?? 0;
    return ((end - this.startValue) / this.startValue) * 100;
  }

  get minValue(): number {
    return Math.min(...this.points.map((p) => p.value));
  }

  get maxValue(): number {
    return Math.max(...this.points.map((p) => p.value));
  }
}
