import crypto from 'crypto';
import { DatabaseConnection } from '../DatabaseConnection';
import {
  NewsClassificationInput,
  NewsClassificationOutput,
  SentimentType,
  ImpactLevelType,
} from '../../../modules/llm/domain/LlmTypes';

export class AiNewsArchiveRepository {
  private static generateHash(title: string): string {
    return crypto.createHash('sha256').update(title.trim().toLowerCase()).digest('hex');
  }

  /**
   * Busca si una noticia ya fue previamente clasificada por la IA
   */
  static findByTitle(title: string): NewsClassificationOutput | null {
    const db = DatabaseConnection.getInstance();
    const hash = this.generateHash(title);

    const stmt = db.prepare(`
      SELECT 
        sentiment,
        impact_level as impactLevel,
        affected_assets_json as affectedAssetsJson,
        transmission_channel as transmissionChannel,
        market_consensus as marketConsensus,
        executive_summary as executiveSummary,
        confidence_score as confidenceScore,
        ai_provider as provider
      FROM ai_news_archive
      WHERE title_hash = ?
    `);

    const row = stmt.get(hash) as any;
    if (!row) return null;

    let affectedAssets: string[] = [];
    try {
      affectedAssets = JSON.parse(row.affectedAssetsJson);
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
   * Guarda una nueva clasificación de noticia en la base de datos
   */
  static saveClassification(
    input: NewsClassificationInput,
    output: NewsClassificationOutput
  ): void {
    const db = DatabaseConnection.getInstance();
    const hash = this.generateHash(input.title);

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO ai_news_archive (
        title_hash, title, summary, source, sentiment, impact_level,
        affected_assets_json, transmission_channel, market_consensus,
        executive_summary, confidence_score, ai_provider
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
      stmt.run(
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
        output.provider
      );
    } catch (err) {
      console.error('[AiNewsArchiveRepository] Error al guardar análisis IA en SQLite:', err);
    }
  }

  /**
   * Obtiene la cantidad de noticias procesadas y guardadas
   */
  static getArchiveCount(): number {
    const db = DatabaseConnection.getInstance();
    const result = db.prepare('SELECT COUNT(*) as total FROM ai_news_archive').get() as { total: number };
    return result?.total || 0;
  }
}
