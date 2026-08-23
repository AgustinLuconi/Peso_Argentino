import { Percentage } from '@core/domain/Percentage';

export interface MacroKpiProps {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  unit: string;
  variation?: number;
  period: string;
  historicalSeries: number[];
  category: 'monetary' | 'fiscal' | 'prices' | 'debt';
  statusNote?: string;
}

export class MacroKpi {
  readonly id: string;
  readonly title: string;
  readonly value: string;
  readonly numericValue: number;
  readonly unit: string;
  readonly variation?: Percentage;
  readonly period: string;
  readonly historicalSeries: number[];
  readonly category: 'monetary' | 'fiscal' | 'prices' | 'debt';
  readonly statusNote?: string;

  constructor(props: MacroKpiProps) {
    this.id = props.id;
    this.title = props.title;
    this.value = props.value;
    this.numericValue = props.numericValue;
    this.unit = props.unit;
    this.variation = props.variation !== undefined ? Percentage.of(props.variation) : undefined;
    this.period = props.period;
    this.historicalSeries = props.historicalSeries;
    this.category = props.category;
    this.statusNote = props.statusNote;
  }
}
