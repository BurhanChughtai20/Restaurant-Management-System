import { redisClient } from "./redis.ts";

// Cache expiration time in seconds (3 minutes = 180 seconds)
const CACHE_EXPIRATION = 3 * 60;

/**
 * Generate a cache key for search/pagination operations
 * @param baseKey - Base key for the cache (e.g., 'search:chefs', 'paginate:menu_items')
 * @param params - Object containing query parameters
 * @returns Generated cache key
 */
export function generateCacheKey(
  baseKey: string,
  params: Record<string, any>
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${JSON.stringify(params[key])}`)
    .join("|");

  return `${baseKey}:${sortedParams}`;
}

/**
 * Get cached data from Redis
 * @param key - Cache key
 * @returns Cached data or null if not found/expired
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
    return null;
  } catch (error) {
    console.error(`Error retrieving cache for key ${key}:`, error);
    return null;
  }
}

/**
 * Set data in Redis cache with 3-minute expiration
 * @param key - Cache key
 * @param data - Data to cache
 * @returns Success status
 */
export async function setCachedData<T>(key: string, data: T): Promise<boolean> {
  try {
    await redisClient.setEx(key, CACHE_EXPIRATION, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error);
    return false;
  }
}

/**
 * Invalidate cache by deleting the key
 * @param key - Cache key to delete
 * @returns Success status
 */
export async function invalidateCache(key: string): Promise<boolean> {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error(`Error invalidating cache for key ${key}:`, error);
    return false;
  }
}

/**
 * Invalidate cache by pattern (useful for invalidating related caches)
 * @param pattern - Pattern to match cache keys (e.g., 'search:chefs:*')
 * @returns Number of keys deleted
 */
export async function invalidateCacheByPattern(
  pattern: string
): Promise<number> {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return keys.length;
  } catch (error) {
    console.error(`Error invalidating cache with pattern ${pattern}:`, error);
    return 0;
  }
}
