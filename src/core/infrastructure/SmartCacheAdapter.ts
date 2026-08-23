import { CachePort, CacheEntry, CacheStats } from '../ports/CachePort';
import { StoragePort } from '../ports/StoragePort';
import { defaultStorage } from './LocalStorageAdapter';

export const CACHE_TTL = {
  DOLLAR_SPOT: 30 * 1000, // 30s - Dólar blue, oficial, mep, ccl
  MARKET_ASSETS: 60 * 1000, // 1 min - Acciones, Bonos, Cedears
  NEWS_INTELLIGENCE: 5 * 60 * 1000, // 5 min - Cables de noticias
  BCRA_RATES: 15 * 60 * 1000, // 15 min - Tasas de interés de política monetaria
  MACRO_SERIES: 60 * 60 * 1000, // 1 hora - Series INDEC / Balanza comercial
  POLITICAL_LAWS: 12 * 60 * 60 * 1000, // 12 horas - Leyes y Proyectos RIGI
  PERMANENT: 24 * 60 * 60 * 1000, // 24 horas - Estructuras maestras
} as const;

export class SmartCacheAdapter implements CachePort {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private storage: StoragePort;
  private hits: number = 0;
  private misses: number = 0;

  constructor(storage: StoragePort = defaultStorage) {
    this.storage = storage;
    this.hydrateFromStorage();
  }

  private hydrateFromStorage(): void {
    try {
      const keys = this.storage.getItem<string[]>('__cache_keys__') || [];
      const now = Date.now();
      keys.forEach((key) => {
        const entry = this.storage.getItem<CacheEntry<any>>(`cache_${key}`);
        if (entry && now - entry.timestamp < entry.ttlMs * 2) {
          this.memoryCache.set(key, entry);
        }
      });
    } catch (e) {
      console.warn('Could not hydrate cache from storage:', e);
    }
  }

  private persistKeyRegistry(): void {
    try {
      const keys = Array.from(this.memoryCache.keys());
      this.storage.setItem('__cache_keys__', keys);
    } catch (e) {
      console.warn('Error persisting key registry:', e);
    }
  }

  get<T>(key: string): CacheEntry<T> | null {
    const memoryEntry = this.memoryCache.get(key);
    const now = Date.now();

    if (memoryEntry) {
      const isExpired = now - memoryEntry.timestamp > memoryEntry.ttlMs;
      if (!isExpired) {
        this.hits++;
        return { ...memoryEntry, source: 'memory' };
      }
    }

    // Try storage fallback
    const storedEntry = this.storage.getItem<CacheEntry<T>>(`cache_${key}`);
    if (storedEntry) {
      const isExpired = now - storedEntry.timestamp > storedEntry.ttlMs;
      if (!isExpired) {
        this.hits++;
        this.memoryCache.set(key, storedEntry);
        return { ...storedEntry, source: 'cache' };
      }
    }

    this.misses++;
    return null;
  }

  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = CACHE_TTL.MARKET_ASSETS
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached) {
      return cached.data;
    }

    try {
      const data = await fetcher();
      this.set(key, data, ttlMs);
      return data;
    } catch (error) {
      // Resilience fallback: If fetch fails, return expired cache if exists
      const staleEntry = this.memoryCache.get(key) || this.storage.getItem<CacheEntry<T>>(`cache_${key}`);
      if (staleEntry) {
        console.warn(`Fetch failed for ${key}, using stale cache fallback:`, error);
        return staleEntry.data;
      }
      throw error;
    }
  }

  set<T>(key: string, data: T, ttlMs: number = CACHE_TTL.MARKET_ASSETS): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttlMs,
      key,
      source: 'network',
    };

    this.memoryCache.set(key, entry);
    try {
      this.storage.setItem(`cache_${key}`, entry);
      this.persistKeyRegistry();
    } catch (e) {
      console.warn(`Failed to persist cache entry for key ${key}:`, e);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  isStale(key: string): boolean {
    const entry = this.memoryCache.get(key) || this.storage.getItem<CacheEntry<any>>(`cache_${key}`);
    if (!entry) return true;
    return Date.now() - entry.timestamp > entry.ttlMs;
  }

  invalidate(key: string): void {
    this.memoryCache.delete(key);
    this.storage.removeItem(`cache_${key}`);
    this.persistKeyRegistry();
  }

  invalidateByPrefix(prefix: string): void {
    const keys = Array.from(this.memoryCache.keys());
    keys.forEach((k) => {
      if (k.startsWith(prefix)) {
        this.invalidate(k);
      }
    });
  }

  clear(): void {
    this.memoryCache.clear();
    const keys = this.storage.getItem<string[]>('__cache_keys__') || [];
    keys.forEach((key) => {
      this.storage.removeItem(`cache_${key}`);
    });
    this.storage.removeItem('__cache_keys__');
    this.hits = 0;
    this.misses = 0;
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      totalEntries: this.memoryCache.size,
      hitRatio: total > 0 ? (this.hits / total) * 100 : 0,
      memoryEntriesCount: this.memoryCache.size,
    };
  }

  getAllKeys(): string[] {
    return Array.from(this.memoryCache.keys());
  }
}

export const smartCache = new SmartCacheAdapter();
