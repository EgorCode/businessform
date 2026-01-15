interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = parseInt(process.env.AI_CACHE_TTL || '300000'); // 5 минут

  set(key: string, data: any, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Очистка истекших записей
  cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    });
    
    if (cleanedCount > 0) {
      console.log(`Cache cleanup: removed ${cleanedCount} expired entries`);
    }
  }

  // Получение статистики кэша
  getStats(): {
    size: number;
    hitRate: number;
    totalRequests: number;
    cacheHits: number;
  } {
    return {
      size: this.cache.size,
      hitRate: this.calculateHitRate(),
      totalRequests: this.totalRequests,
      cacheHits: this.cacheHits,
    };
  }

  // Приватные поля для статистики
  private totalRequests = 0;
  private cacheHits = 0;

  // Регистрация запроса к кэшу
  recordRequest(hit: boolean): void {
    this.totalRequests++;
    if (hit) {
      this.cacheHits++;
    }
  }

  private calculateHitRate(): number {
    if (this.totalRequests === 0) return 0;
    return (this.cacheHits / this.totalRequests) * 100;
  }
}

export const cacheService = new CacheService();

// Периодическая очистка кэша каждую минуту
setInterval(() => cacheService.cleanup(), 60000);

// Логирование статистики каждые 5 минут
setInterval(() => {
  const stats = cacheService.getStats();
  console.log('Cache Stats:', stats);
}, 300000);