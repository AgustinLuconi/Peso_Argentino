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
  scope?: 'nacional' | 'internacional';
  region?: string;
  publishedAt: string;
  editionDate?: string;
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
  readonly scope: 'nacional' | 'internacional';
  readonly region: string;
  readonly publishedAt: string;
  readonly editionDate: string;
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
    this.scope = props.scope || (props.source.includes('Bloomberg') || props.source.includes('WSJ') || props.source.includes('Reuters') || props.source.includes('Financial Times') || props.source.includes('Morgan') || props.source.includes('Federal Reserve') ? 'internacional' : 'nacional');
    this.region = props.region || (this.scope === 'internacional' ? (props.source.includes('WSJ') || props.source.includes('Fed') || props.source.includes('IMF') ? 'Estados Unidos 🇺🇸' : 'Global / Wall Street 🌐') : 'Argentina 🇦🇷');
    this.publishedAt = props.publishedAt;
    this.editionDate = props.editionDate || new Date().toISOString().split('T')[0];
    this.summary = props.summary;
    this.keyTakeaways = props.keyTakeaways;
    this.affectedAssets = props.affectedAssets;
    this.marketSentiment = props.marketSentiment;
    this.readTimeMinutes = props.readTimeMinutes;
  }
}
