import fs from 'fs';
import path from 'path';
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

export class DatabaseConnection {
  private static sqlClient: NeonQueryFunction<false, false> | null = null;
  private static databaseUrl: string | null = null;
  private static warnedMissingUrl: boolean = false;

  /**
   * Resuelve la URL de conexión de Neon desde variables de entorno o archivo .env
   */
  private static resolveDatabaseUrl(): string | null {
    // Si process.env no tiene la variable cargada, intentar cargarla desde el archivo .env
    if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL && !process.env.NEON_DATABASE_URL) {
      try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf-8');
          envContent.split('\n').forEach((line: string) => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
              const [key, ...rest] = trimmed.split('=');
              if (key && rest.length > 0) {
                let val = rest.join('=').trim();
                // Strip surrounding quotes
                if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
                  val = val.substring(1, val.length - 1);
                }
                process.env[key.trim()] = val;
              }
            }
          });
        }
      } catch {
        // Ignored
      }
    }

    let url =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.NEON_DATABASE_URL;

    if (url) {
      url = url.trim();
      if ((url.startsWith("'") && url.endsWith("'")) || (url.startsWith('"') && url.endsWith('"'))) {
        url = url.substring(1, url.length - 1);
      }
      if (url.length > 0 && !url.includes('tu_password')) {
        return url;
      }
    }

    return null;
  }

  /**
   * Obtiene la instancia de la función SQL de Neon
   */
  static getClient(): NeonQueryFunction<false, false> | null {
    if (!this.sqlClient) {
      const url = this.resolveDatabaseUrl();
      if (!url) {
        if (!this.warnedMissingUrl) {
          console.warn('[Database] ⚠️ DATABASE_URL de Neon no configurada en .env.');
          console.warn('[Database] 💡 Agrega tu cadena de conexión de Neon en .env (DATABASE_URL=postgresql://...).');
          this.warnedMissingUrl = true;
        }
        return null;
      }

      this.databaseUrl = url;
      this.sqlClient = neon(url);
      console.log('[Database] 🐘 Neon Serverless PostgreSQL inicializado exitosamente.');
    }

    return this.sqlClient;
  }

  /**
   * Indica si la base de datos Neon está configurada con credenciales válidas
   */
  static isConfigured(): boolean {
    return Boolean(this.resolveDatabaseUrl());
  }

  /**
   * Nombre del motor de base de datos para telemetría
   */
  static getEngineName(): string {
    return 'Neon Serverless PostgreSQL';
  }

  /**
   * Ejecuta una consulta SELECT tipada y parametrizada
   */
  static async query<T = Record<string, unknown>>(
    queryText: string,
    params: readonly unknown[] = []
  ): Promise<readonly T[]> {
    const client = this.getClient();
    if (!client) {
      return [];
    }

    try {
      const rows = (await client.query(
        queryText,
        params as unknown[]
      )) as unknown as T[];
      return rows;
    } catch (error) {
      console.error('[Database] ❌ Error en consulta Neon:', error);
      throw error;
    }
  }

  /**
   * Ejecuta una consulta SELECT retornando el primer registro o null
   */
  static async queryOne<T = Record<string, unknown>>(
    queryText: string,
    params: readonly unknown[] = []
  ): Promise<T | null> {
    const rows = await this.query<T>(queryText, params);
    return rows[0] ?? null;
  }

  /**
   * Ejecuta una sentencia DDL o DML (INSERT, UPDATE, DELETE)
   */
  static async execute(
    queryText: string,
    params: readonly unknown[] = []
  ): Promise<void> {
    const client = this.getClient();
    if (!client) return;

    try {
      await client.query(queryText, params as unknown[]);
    } catch (error) {
      console.error('[Database] ❌ Error en ejecución DDL/DML Neon:', error);
      throw error;
    }
  }

  static close(): void {
    this.sqlClient = null;
    console.log('[Database] Conexión a Neon liberada.');
  }
}
