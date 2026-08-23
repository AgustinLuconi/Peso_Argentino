import { HttpClient } from '../../../core/http/HttpClient';
import {
  NewsClassificationInput,
  NewsClassificationOutput,
  ChatMessage,
  ChatResponse,
} from '../domain/LlmTypes';
import { LocalFinancialNlpAdapter } from './LocalFinancialNlpAdapter';

export class GeminiLlmAdapter {
  private static getApiKey(): string | null {
    return process.env.GEMINI_API_KEY || null;
  }

  /**
   * Clasifica una noticia económica utilizando Google Gemini Free Tier.
   */
  static async classifyNews(input: NewsClassificationInput): Promise<NewsClassificationOutput> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      // Fallback a motor local gratuito con 0 dependencias
      return LocalFinancialNlpAdapter.classifyNews(input);
    }

    try {
      const prompt = `Eres un analista macroeconómico institucional para la plataforma "Peso Argentino".
Analiza la siguiente noticia financiera y clasifícala devolviendo estrictamente un JSON válido con este esquema:
{
  "sentiment": "bullish" | "bearish" | "neutral",
  "impactLevel": "critico" | "alto" | "moderado",
  "affectedAssets": ["string", "string"],
  "transmissionChannel": "Explicación del canal macroeconómico en 1 oración",
  "marketConsensus": "Consenso del mercado en 1 oración",
  "executiveSummary": "Resumen ejecutivo en 1 oración",
  "confidenceScore": 0.95
}

Noticia a clasificar:
Título: "${input.title}"
Resumen: "${input.summary}"
Fuente: "${input.source || 'Agencia Financiera'}"`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const response = await HttpClient.get<any>(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: 'application/json',
            temperature: 0.1,
          },
        }),
      });

      const textResponse = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResponse) throw new Error('Empty Gemini response');

      const parsed = JSON.parse(textResponse);

      return {
        sentiment: parsed.sentiment || 'neutral',
        impactLevel: parsed.impactLevel || 'moderado',
        affectedAssets: parsed.affectedAssets || ['Mercado'],
        transmissionChannel: parsed.transmissionChannel || 'Canal macroeconómico estándar.',
        marketConsensus: parsed.marketConsensus || 'Consenso de analistas en desarrollo.',
        executiveSummary: parsed.executiveSummary || input.summary,
        confidenceScore: parsed.confidenceScore || 0.95,
        provider: 'gemini-1.5-flash-free',
      };
    } catch (error) {
      console.warn('[GeminiLlmAdapter] Error en llamada a Gemini Free API, usando fallback local:', error);
      return LocalFinancialNlpAdapter.classifyNews(input);
    }
  }

  /**
   * Responde consultas financieras del usuario con Gemini Free Tier.
   */
  static async chat(messages: readonly ChatMessage[], macroContext?: any): Promise<ChatResponse> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      return LocalFinancialNlpAdapter.answerFinancialQuery(messages, macroContext);
    }

    const start = Date.now();

    try {
      const systemPrompt = `Eres "Antigravity Copiloto Financiero", el asistente de inteligencia artificial institucional de la plataforma "Peso Argentino".
Tu rol es brindar análisis riguroso, objetivo y respaldado por datos sobre:
- Mercado de cambios (Dólar Oficial BNA, MEP AL30, CCL, Cripto, brechas).
- Política monetaria del BCRA (LEFIs del Tesoro, pases pasivos eliminados, base monetaria).
- Curva de deuda soberana (Bonos AL30, GD30, paridades, TIR, cupones step-up, Lecaps).
- Régimen del RIGI (Ley 27.742) y Paquete Fiscal (Ley 27.743).
- Inflación INDEC (IPC), UVA, ICL y CER.

Responde de forma clara, ejecutiva y estructurada con viñetas en formato Markdown.`;

      const contents = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Entendido. Estoy listo para brindar análisis financiero institucional de la República Argentina.' }] },
        ...messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      ];

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const response = await HttpClient.get<any>(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 600,
          },
        }),
      });

      const textResponse = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResponse) throw new Error('Empty Gemini chat response');

      return {
        reply: textResponse,
        suggestions: [
          '¿Cuál es la diferencia entre AL30 y GD30?',
          '¿Cómo impacta la baja de tasas en el dólar MEP?',
          '¿Qué proyectos lideran las inversiones del RIGI?',
        ],
        provider: 'gemini-1.5-flash-free',
        latencyMs: Date.now() - start,
      };
    } catch (error) {
      console.warn('[GeminiLlmAdapter] Chat Gemini error, fallback local:', error);
      return LocalFinancialNlpAdapter.answerFinancialQuery(messages, macroContext);
    }
  }
}
