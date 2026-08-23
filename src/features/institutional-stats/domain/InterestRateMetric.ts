import { Percentage } from '@core/domain/Percentage';

export interface InterestRateProps {
  id: string;
  name: string;
  tna: number;
  tea: number;
  tem: number; // Tasa efectiva mensual
  type: 'policy' | 'deposits' | 'market' | 'interbank';
  description: string;
}

export class InterestRateMetric {
  readonly id: string;
  readonly name: string;
  readonly tna: Percentage;
  readonly tea: Percentage;
  readonly tem: Percentage;
  readonly type: 'policy' | 'deposits' | 'market' | 'interbank';
  readonly description: string;

  constructor(props: InterestRateProps) {
    this.id = props.id;
    this.name = props.name;
    this.tna = Percentage.of(props.tna);
    this.tea = Percentage.of(props.tea);
    this.tem = Percentage.of(props.tem);
    this.type = props.type;
    this.description = props.description;
  }
}
