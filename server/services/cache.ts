interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

class ServerCache {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttlMs) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttlMs,
    });
  }

  async getOrFetch<T>(key: string, fetcher: () => Promise<T>, ttlMs: number): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }
    try {
      const data = await fetcher();
      this.set(key, data, ttlMs);
      return data;
    } catch (err) {
      // If error occurs, return stale cache if exists to guarantee uptime
      const stale = this.cache.get(key);
      if (stale) {
        console.warn(`[ServerCache] Fetch failed for ${key}, serving stale cache:`, err);
        return stale.data;
      }
      throw err;
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const serverCache = new ServerCache();
