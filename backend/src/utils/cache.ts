import NodeCache from 'node-cache';

class CacheService {
  private cache: NodeCache;

  constructor(ttlSeconds: number = 1800) { // 30 minutes default
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false
    });

    // Log cache statistics every 10 minutes
    setInterval(() => {
      console.log('Cache Stats:', this.getStats());
    }, 10 * 60 * 1000);
  }

  get<T>(key: string): T | undefined {
    const value = this.cache.get<T>(key);
    if (value) {
      console.log(`Cache HIT for key: ${key}`);
    } else {
      console.log(`Cache MISS for key: ${key}`);
    }
    return value;
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    const result = this.cache.set(key, value, ttl || 0);
    console.log(`Cache SET for key: ${key}, success: ${result}`);
    return result;
  }

  del(keys: string | string[]): number {
    return this.cache.del(keys);
  }

  flush(): void {
    this.cache.flushAll();
    console.log('Cache flushed');
  }

  getStats() {
    return this.cache.getStats();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  keys(): string[] {
    return this.cache.keys();
  }
}

export default new CacheService(); 