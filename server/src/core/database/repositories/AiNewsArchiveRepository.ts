import crypto from 'crypto';
import { DatabaseConnection } from '../DatabaseConnection';
import {
  NewsClassificationInput,
  NewsClassificationOutput,
  SentimentType,
  ImpactLevelType,
} from '../../../modules/llm/domain/LlmTypes';

interface AiNewsArchiveRow {
  readonly sentiment: string;
  readonly impactLevel: string;
  readonly affectedAssetsJson: string;
  readonly transmissionChannel: string;
  readonly marketConsensus: string;
  readonly executiveSummary: string;
  readonly confidenceScore: number;
  readonly provider: string;
}

export class AiNewsArchiveRepository {
  private static generateHash(title: string): string {
    return crypto.createHash('sha256').update(title.trim().toLowerCase()).digest('hex');
  }

  /**
   * Busca si una noticia ya fue previamente clasificada por la IA en Neon
   */
  static async findByTitle(title: string): Promise<NewsClassificationOutput | null> {
    const hash = this.generateHash(title);

    const row = await DatabaseConnection.queryOne<AiNewsArchiveRow>(
      `SELECT 
        sentiment,
        impact_level as "impactLevel",
        affected_assets_json as "affectedAssetsJson",
        transmission_channel as "transmissionChannel",
        market_consensus as "marketConsensus",
        executive_summary as "executiveSummary",
        confidence_score::float as "confidenceScore",
        ai_provider as "provider"
      FROM ai_news_archive
      WHERE title_hash = $1`,
      [hash]
    );

    if (!row) return null;

    let affectedAssets: readonly string[] = [];
    try {
      const parsed = JSON.parse(row.affectedAssetsJson);
      affectedAssets = Array.isArray(parsed) ? parsed : ['Mercado'];
    } catch {
      affectedAssets = ['Mercado'];
    }

    return {
      sentiment: row.sentiment as SentimentType,
      impactLevel: row.impactLevel as ImpactLevelType,
      affectedAssets,
      transmissionChannel: row.transmissionChannel,
      marketConsensus: row.marketConsensus,
      executiveSummary: row.executiveSummary,
      confidenceScore: row.confidenceScore,
      provider: `${row.provider} (cached-db)`,
    };
  }

  /**
   * Guarda una nueva clasificación de noticia en Neon PostgreSQL
   */
  static async saveClassification(
    input: NewsClassificationInput,
    output: NewsClassificationOutput
  ): Promise<void> {
    if (!DatabaseConnection.isConfigured()) {
      return;
    }

    const hash = this.generateHash(input.title);

    try {
      await DatabaseConnection.execute(
        `INSERT INTO ai_news_archive (
          title_hash, title, summary, source, sentiment, impact_level,
          affected_assets_json, transmission_channel, market_consensus,
          executive_summary, confidence_score, ai_provider
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (title_hash) DO UPDATE SET
          sentiment = EXCLUDED.sentiment,
          impact_level = EXCLUDED.impact_level,
          executive_summary = EXCLUDED.executive_summary`,
        [
          hash,
          input.title,
          input.summary,
          input.source || 'Agencia Financiera',
          output.sentiment,
          output.impactLevel,
          JSON.stringify(output.affectedAssets),
          output.transmissionChannel,
          output.marketConsensus,
          output.executiveSummary,
          output.confidenceScore,
          output.provider,
        ]
      );
    } catch (err) {
      console.error('[AiNewsArchiveRepository] Error al guardar análisis IA en Neon:', err);
    }
  }

  /**
   * Obtiene la cantidad de noticias procesadas y guardadas
   */
  static async getArchiveCount(): Promise<number> {
    const result = await DatabaseConnection.queryOne<{ total: string | number }>(
      'SELECT COUNT(*)::int as total FROM ai_news_archive'
    );

    if (!result) return 0;
    return typeof result.total === 'number' ? result.total : Number(result.total) || 0;
  }
}
