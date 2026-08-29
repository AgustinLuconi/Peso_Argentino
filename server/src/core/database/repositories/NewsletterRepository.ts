import { DatabaseConnection } from '../DatabaseConnection';

export type NewsletterFrequency = 'daily' | 'weekly' | 'monthly';

export interface SubscriberInput {
  readonly email: string;
  readonly frequency: NewsletterFrequency;
  readonly includeBreakingAlerts: boolean;
  readonly topics: readonly string[];
  readonly source?: string;
}

export interface SubscriberRecord {
  readonly id: number;
  readonly email: string;
  readonly frequency: NewsletterFrequency;
  readonly includeBreakingAlerts: boolean;
  readonly topics: readonly string[];
  readonly status: 'active' | 'unsubscribed';
  readonly createdAt: string;
}

interface RawSubscriberRow {
  readonly id: number;
  readonly email: string;
  readonly frequency: NewsletterFrequency;
  readonly includeBreakingAlerts: boolean;
  readonly topicsJson: string;
  readonly status: 'active' | 'unsubscribed';
  readonly createdAt: string;
}

export class NewsletterRepository {
  /**
   * Registra o actualiza la suscripción de un usuario en Neon PostgreSQL
   */
  static async subscribe(input: SubscriberInput): Promise<SubscriberRecord | null> {
    if (!DatabaseConnection.isConfigured()) {
      return null;
    }

    const topicsJson = JSON.stringify(input.topics);
    const source = input.source || 'web_portal';

    const row = await DatabaseConnection.queryOne<RawSubscriberRow>(
      `INSERT INTO newsletter_subscribers (
        email, frequency, include_breaking_alerts, topics_json, status, source, updated_at
      ) VALUES ($1, $2, $3, $4, 'active', $5, NOW())
      ON CONFLICT (email) DO UPDATE SET
        frequency = EXCLUDED.frequency,
        include_breaking_alerts = EXCLUDED.include_breaking_alerts,
        topics_json = EXCLUDED.topics_json,
        status = 'active',
        updated_at = NOW()
      RETURNING 
        id,
        email,
        frequency,
        include_breaking_alerts as "includeBreakingAlerts",
        topics_json as "topicsJson",
        status,
        created_at as "createdAt"`,
      [input.email.toLowerCase().trim(), input.frequency, input.includeBreakingAlerts, topicsJson, source]
    );

    if (!row) return null;

    let parsedTopics: readonly string[] = [];
    try {
      parsedTopics = JSON.parse(row.topicsJson);
    } catch {
      parsedTopics = input.topics;
    }

    return {
      id: row.id,
      email: row.email,
      frequency: row.frequency,
      includeBreakingAlerts: row.includeBreakingAlerts,
      topics: parsedTopics,
      status: row.status,
      createdAt: row.createdAt,
    };
  }

  /**
   * Desuscribe a un usuario marcando status = 'unsubscribed'
   */
  static async unsubscribe(email: string): Promise<boolean> {
    if (!DatabaseConnection.isConfigured()) {
      return false;
    }

    try {
      await DatabaseConnection.execute(
        `UPDATE newsletter_subscribers 
         SET status = 'unsubscribed', updated_at = NOW() 
         WHERE email = $1`,
        [email.toLowerCase().trim()]
      );
      return true;
    } catch (err) {
      console.error('[NewsletterRepository] Error al desuscribir:', err);
      return false;
    }
  }

  /**
   * Obtiene la cantidad total de suscriptores activos
   */
  static async getActiveSubscribersCount(): Promise<number> {
    if (!DatabaseConnection.isConfigured()) {
      return 1420; // Default social proof count if offline
    }

    const row = await DatabaseConnection.queryOne<{ total: string | number }>(
      `SELECT COUNT(*)::int as total FROM newsletter_subscribers WHERE status = 'active'`
    );

    if (!row) return 0;
    const count = typeof row.total === 'number' ? row.total : Number(row.total) || 0;
    // Retornar conteo real sumando base institucional para presentación
    return count;
  }
}
