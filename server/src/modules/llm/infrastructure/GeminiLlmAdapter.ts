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
   * Modelos Gemini recomendados en orden de prioridad
   */
  private static readonly MODEL_CANDIDATES = [
    'gemini-3.6-flash',
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-1.5-flash',
  ];

  /**
   * Clasifica una noticia económica utilizando Google Gemini Free Tier.
   */
  static async classifyNews(input: NewsClassificationInput): Promise<NewsClassificationOutput> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      // Fallback a motor local gratuito con 0 dependencias
      return LocalFinancialNlpAdapter.classifyNews(input);
    }

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

    for (const model of this.MODEL_CANDIDATES) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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
        if (!textResponse) continue;

        const parsed = JSON.parse(textResponse);

        return {
          sentiment: parsed.sentiment || 'neutral',
          impactLevel: parsed.impactLevel || 'moderado',
          affectedAssets: parsed.affectedAssets || ['Mercado'],
          transmissionChannel: parsed.transmissionChannel || 'Canal macroeconómico estándar.',
          marketConsensus: parsed.marketConsensus || 'Consenso de analistas en desarrollo.',
          executiveSummary: parsed.executiveSummary || input.summary,
          confidenceScore: parsed.confidenceScore || 0.95,
          provider: model,
        };
      } catch (error) {
        console.warn(`[GeminiLlmAdapter] Error con modelo ${model}:`, error);
      }
    }

    console.warn('[GeminiLlmAdapter] Usando fallback local para clasificación.');
    return LocalFinancialNlpAdapter.classifyNews(input);
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

    for (const model of this.MODEL_CANDIDATES) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await HttpClient.get<any>(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 800,
            },
          }),
        });

        const textResponse = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textResponse) continue;

        return {
          reply: textResponse,
          suggestions: [
            '¿Cuál es la diferencia entre AL30 y GD30?',
            '¿Cómo impacta la baja de tasas en el dólar MEP?',
            '¿Qué proyectos lideran las inversiones del RIGI?',
          ],
          provider: model,
          latencyMs: Date.now() - start,
        };
      } catch (error) {
        console.warn(`[GeminiLlmAdapter] Chat con ${model} falló:`, error);
      }
    }

    console.warn('[GeminiLlmAdapter] Chat fallback local.');
    return LocalFinancialNlpAdapter.answerFinancialQuery(messages, macroContext);
  }
}
