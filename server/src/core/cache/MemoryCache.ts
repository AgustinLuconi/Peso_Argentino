interface CacheOptions {
  ttlMs: number;
}

interface CacheItem<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
}

export class MemoryCache {
  private store = new Map<string, CacheItem<any>>();
  private hits = 0;
  private misses = 0;

  get<T>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) {
      this.misses++;
      return null;
    }
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }
    this.hits++;
    return item.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
      createdAt: Date.now(),
    });
  }

  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlMs: number): Promise<T> {
    const existing = this.get<T>(key);
    if (existing !== null) {
      return existing;
    }

    try {
      const freshData = await fetcher();
      this.set(key, freshData, ttlMs);
      return freshData;
    } catch (error) {
      // Return expired cache if available for high resilience (Stale-While-Revalidate fallback)
      const staleItem = this.store.get(key);
      if (staleItem) {
        console.warn(`[MemoryCache] Fetch failed for "${key}". Serving stale cached data:`, error);
        return staleItem.data as T;
      }
      throw error;
    }
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }

  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRatio: total > 0 ? Number(((this.hits / total) * 100).toFixed(2)) : 0,
    };
  }
}

export const globalCache = new MemoryCache();
