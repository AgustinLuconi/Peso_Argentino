import { GeminiLlmAdapter } from '../infrastructure/GeminiLlmAdapter';
import {
  NewsClassificationInput,
  NewsClassificationOutput,
  ChatMessage,
  ChatResponse,
} from '../domain/LlmTypes';
import { globalCache } from '../../../core/cache/MemoryCache';

export class LlmService {
  private static readonly TTL_CLASSIFY = 60 * 60 * 1000; // 1 hour cache per news

  static async classify(input: NewsClassificationInput): Promise<NewsClassificationOutput> {
    const cacheKey = `llm_classify_${input.title.slice(0, 30).toLowerCase().replace(/\s+/g, '_')}`;

    return globalCache.getOrSet(
      cacheKey,
      async () => {
        return await GeminiLlmAdapter.classifyNews(input);
      },
      LlmService.TTL_CLASSIFY
    );
  }

  static async chat(messages: readonly ChatMessage[], macroContext?: any): Promise<ChatResponse> {
    return await GeminiLlmAdapter.chat(messages, macroContext);
  }

  static getEngineStatus() {
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
    return {
      activeEngine: hasGeminiKey ? 'Google Gemini 1.5 Flash (Free Tier)' : 'Financial NLP Engine Local (100% Gratis)',
      freeTierEnabled: true,
      hasCustomApiKey: hasGeminiKey,
      costPerQueryUsd: 0,
      supportedFeatures: [
        'Clasificación y Análisis de Sentimiento de Noticias',
        'Canales de Transmisión Macroeconómica',
        'Copiloto Financiero IA (Q&A Interactivo)',
        'Análisis de Deuda Soberana y Carry Trade',
      ],
    };
  }
}
