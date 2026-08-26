import { Prettify } from '@core/types/type-utils';
import { API_CONFIG } from '@core/config/api.config';

export interface LlmClassificationDto {
  readonly sentiment: 'bullish' | 'bearish' | 'neutral';
  readonly impactLevel: 'critico' | 'alto' | 'moderado';
  readonly affectedAssets: readonly string[];
  readonly transmissionChannel: string;
  readonly marketConsensus: string;
  readonly executiveSummary: string;
  readonly confidenceScore: number;
  readonly provider: string;
}

export interface LlmChatResponseDto {
  readonly reply: string;
  readonly suggestions: readonly string[];
  readonly provider: string;
  readonly latencyMs: number;
}

export interface LlmEngineStatusDto {
  readonly activeEngine: string;
  readonly freeTierEnabled: boolean;
  readonly hasCustomApiKey: boolean;
  readonly costPerQueryUsd: number;
  readonly supportedFeatures: readonly string[];
}

export class LlmApiClient {
  private static readonly BASE_URL = API_CONFIG.getEndpoint('/api/v1/llm');

  static async getStatus(): Promise<LlmEngineStatusDto | null> {
    try {
      const res = await fetch(`${this.BASE_URL}/status`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  static async classifyNews(
    title: string,
    summary: string,
    source?: string
  ): Promise<LlmClassificationDto | null> {
    try {
      const res = await fetch(`${this.BASE_URL}/classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, summary, source }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  static async askAssistant(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
  ): Promise<LlmChatResponseDto | null> {
    try {
      const res = await fetch(`${this.BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }
}
