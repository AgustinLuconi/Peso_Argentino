export type ImpactLevel = 'critico' | 'alto' | 'moderado';
export type NewsCategory =
  | 'macro'
  | 'bcra'
  | 'deuda'
  | 'mercados'
  | 'energia'
  | 'politica';

export interface IntelligenceNewsProps {
  id: string;
  title: string;
  category: NewsCategory;
  impactLevel: ImpactLevel;
  source: string;
  publishedAt: string;
  summary: string;
  keyTakeaways: string[];
  affectedAssets: string[];
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  readTimeMinutes: number;
}

export class IntelligenceNews {
  readonly id: string;
  readonly title: string;
  readonly category: NewsCategory;
  readonly impactLevel: ImpactLevel;
  readonly source: string;
  readonly publishedAt: string;
  readonly summary: string;
  readonly keyTakeaways: string[];
  readonly affectedAssets: string[];
  readonly marketSentiment: 'bullish' | 'bearish' | 'neutral';
  readonly readTimeMinutes: number;

  constructor(props: IntelligenceNewsProps) {
    this.id = props.id;
    this.title = props.title;
    this.category = props.category;
    this.impactLevel = props.impactLevel;
    this.source = props.source;
    this.publishedAt = props.publishedAt;
    this.summary = props.summary;
    this.keyTakeaways = props.keyTakeaways;
    this.affectedAssets = props.affectedAssets;
    this.marketSentiment = props.marketSentiment;
    this.readTimeMinutes = props.readTimeMinutes;
  }
}
