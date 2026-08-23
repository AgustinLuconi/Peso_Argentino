export type LegislativeType = 'ley' | 'dnu' | 'reforma' | 'resolucion';
export type LegislativeStatus =
  | 'promulgada'
  | 'aprobada'
  | 'en_debate'
  | 'en_comision'
  | 'ratificada';

export interface LegislativeItemProps {
  id: string;
  code: string;
  title: string;
  type: LegislativeType;
  status: LegislativeStatus;
  chambers: string;
  impactSector: string;
  economicImpact: 'Muy Alto' | 'Alto' | 'Moderado';
  summary: string;
  date: string;
}

export class LegislativeItem {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly type: LegislativeType;
  readonly status: LegislativeStatus;
  readonly chambers: string;
  readonly impactSector: string;
  readonly economicImpact: 'Muy Alto' | 'Alto' | 'Moderado';
  readonly summary: string;
  readonly date: string;

  constructor(props: LegislativeItemProps) {
    this.id = props.id;
    this.code = props.code;
    this.title = props.title;
    this.type = props.type;
    this.status = props.status;
    this.chambers = props.chambers;
    this.impactSector = props.impactSector;
    this.economicImpact = props.economicImpact;
    this.summary = props.summary;
    this.date = props.date;
  }
}
