/**
 * Tipos de Dominio para el Motor de IA / LLM
 * Siguiendo estándares de Total TypeScript (Matt Pocock)
 */

export type SentimentType = 'bullish' | 'bearish' | 'neutral';
export type ImpactLevelType = 'critico' | 'alto' | 'moderado';

export interface NewsClassificationInput {
  readonly title: string;
  readonly summary: string;
  readonly source?: string;
}

export interface NewsClassificationOutput {
  readonly sentiment: SentimentType;
  readonly impactLevel: ImpactLevelType;
  readonly affectedAssets: readonly string[];
  readonly transmissionChannel: string;
  readonly marketConsensus: string;
  readonly executiveSummary: string;
  readonly confidenceScore: number; // 0 to 1
  readonly provider: 'gemini-1.5-flash-free' | 'financial-nlp-engine';
}

export interface ChatMessage {
  readonly role: 'user' | 'assistant' | 'system';
  readonly content: string;
}

export interface ChatResponse {
  readonly reply: string;
  readonly suggestions: readonly string[];
  readonly provider: string;
  readonly latencyMs: number;
}
