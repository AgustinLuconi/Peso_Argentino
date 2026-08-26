import { GeminiLlmAdapter } from '../infrastructure/GeminiLlmAdapter';
import {
  NewsClassificationInput,
  NewsClassificationOutput,
  ChatMessage,
  ChatResponse,
} from '../domain/LlmTypes';
import { globalCache } from '../../../core/cache/MemoryCache';
import { AiNewsArchiveRepository } from '../../../core/database/repositories/AiNewsArchiveRepository';

export class LlmService {
  private static readonly TTL_CLASSIFY = 60 * 60 * 1000; // 1 hour RAM cache

  static async classify(input: NewsClassificationInput): Promise<NewsClassificationOutput> {
    // 1. Check in SQLite Persistent Database first (0ms)
    const stored = AiNewsArchiveRepository.findByTitle(input.title);
    if (stored) {
      return stored;
    }

    // 2. Check RAM cache or execute Gemini / Local NLP inference
    const cacheKey = `llm_classify_${input.title.slice(0, 30).toLowerCase().replace(/\s+/g, '_')}`;

    const result = await globalCache.getOrSet(
      cacheKey,
      async () => {
        return await GeminiLlmAdapter.classifyNews(input);
      },
      LlmService.TTL_CLASSIFY
    );

    // 3. Persist to SQLite for future sessions
    AiNewsArchiveRepository.saveClassification(input, result);

    return result;
  }

  static async chat(messages: readonly ChatMessage[], macroContext?: any): Promise<ChatResponse> {
    return await GeminiLlmAdapter.chat(messages, macroContext);
  }

  static getEngineStatus() {
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
    const totalStored = AiNewsArchiveRepository.getArchiveCount();

    return {
      activeEngine: hasGeminiKey ? 'Google Gemini Flash (Free Tier)' : 'Financial NLP Engine Local (100% Gratis)',
      freeTierEnabled: true,
      hasCustomApiKey: hasGeminiKey,
      costPerQueryUsd: 0,
      persistentStorage: 'SQLite (WAL Mode)',
      totalClassifiedNewsInDb: totalStored,
      supportedFeatures: [
        'Clasificación y Análisis de Sentimiento de Noticias',
        'Canales de Transmisión Macroeconómica',
        'Copiloto Financiero IA (Q&A Interactivo)',
        'Análisis de Deuda Soberana y Carry Trade',
        'Persistencia Permanente en Base de Datos SQLite',
      ],
    };
  }
}
