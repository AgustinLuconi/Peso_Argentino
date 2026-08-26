import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

export class DatabaseConnection {
  private static instance: DatabaseSync | null = null;
  private static dbPath: string = '';

  /**
   * Obtiene la instancia única de la base de datos SQLite (Patrón Singleton)
   */
  static getInstance(): DatabaseSync {
    if (!this.instance) {
      const dataDir = path.resolve(process.cwd(), 'server', 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      this.dbPath = path.resolve(dataDir, 'peso_argentino.db');
      this.instance = new DatabaseSync(this.dbPath);

      // Optimizaciones de alto rendimiento para SQLite en producción
      this.instance.exec(`
        PRAGMA journal_mode = WAL;
        PRAGMA synchronous = NORMAL;
        PRAGMA foreign_keys = ON;
        PRAGMA busy_timeout = 5000;
        PRAGMA cache_size = -64000; -- 64MB de caché en memoria
      `);

      console.log(`[Database] 🗄️ SQLite conectado exitosamente en: ${this.dbPath}`);
    }

    return this.instance;
  }

  static getDbPath(): string {
    return this.dbPath;
  }

  static close(): void {
    if (this.instance) {
      this.instance.close();
      this.instance = null;
      console.log('[Database] Conexión a SQLite cerrada correctamente.');
    }
  }
}
