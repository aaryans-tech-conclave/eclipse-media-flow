class Cache {
  private cache: Map<string, { value: any; expiry: number }>;

  constructor() {
    this.cache = new Map();
  }

  get<T>(key: string): T | null {
    if (process.env.NODE_ENV === 'production') {
      return null; // No caching in production/Vercel
    }

    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key: string, value: any, ttlSeconds: number): void {
    if (process.env.NODE_ENV === 'production') {
      return; // No caching in production/Vercel
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  }
}

export default new Cache(); 