import { redisClient } from "./redis.ts";

const EXPIRATION_SECONDS = 3 * 60;

function parseJSON<T>(data: string): T {
  return JSON.parse(data) as T;
}
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const data = await redisClient.get(key);

    if (!data) {
      return null;
    }

    return parseJSON<T>(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Redis GET failed for key "${key}": ${message}`);
  }
}

export async function setCachedData<T>(
  key: string,
  data: T,
  ttlSeconds: number = EXPIRATION_SECONDS
): Promise<void> {
  try {
    const stringifiedData = JSON.stringify(data);
    await redisClient.setEx(key, ttlSeconds, stringifiedData);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Redis SET failed for key "${key}": ${message}`);
  }
}
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const paramsString = Object.entries(params).map(([key, value]) => `${key}: ${value}`).join("|");
  return `${prefix}|${paramsString}`;
}