export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
  key: string;
  source: 'network' | 'cache' | 'memory' | 'fallback';
}

export interface CacheStats {
  hits: number;
  misses: number;
  totalEntries: number;
  hitRatio: number;
  memoryEntriesCount: number;
}

export interface CachePort {
  get<T>(key: string): CacheEntry<T> | null;
  getOrFetch<T>(key: string, fetcher: () => Promise<T>, ttlMs?: number): Promise<T>;
  set<T>(key: string, data: T, ttlMs?: number): void;
  has(key: string): boolean;
  isStale(key: string): boolean;
  invalidate(key: string): void;
  invalidateByPrefix(prefix: string): void;
  clear(): void;
  getStats(): CacheStats;
  getAllKeys(): string[];
}
