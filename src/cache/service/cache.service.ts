import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async setCache(keys: string, value: unknown, ttl: number) {
    await this.cacheManager.store.set(keys, value, { ttl });
    return true;
  }

  async getCache(keys: string) {
    const cache = await this.cacheManager.get(keys);
    return cache;
  }

  async delCache(keys: string) {
    const cache = await this.cacheManager.del(keys);
    return cache;
  }

  async delMenuCache(market_id: number) {
    const trans_code = ['ko', 'km', 'en', 'zh'];

    trans_code.forEach(async (code) => {
      await this.cacheManager.del(
        `/menu/user/all?market_id=${market_id}&language_code=${code}`
      );
    });
  }
}
