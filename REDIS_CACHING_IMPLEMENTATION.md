# Redis Caching Implementation for Search & Pagination APIs

## Overview

This document explains the Redis caching implementation applied to all search and pagination APIs in the Restaurant Management System. The caching mechanism stores frequently accessed data for 3 minutes (180 seconds) to optimize performance and reduce database load.

## Features

- **3-Minute Cache TTL**: All cached data automatically expires after 3 minutes
- **Intelligent Cache Keys**: Cache keys include all query parameters to ensure unique caching per request
- **Fallback Mechanism**: If Redis is unavailable, the system falls back to direct database queries
- **Multi-Parameter Support**: Caching works with all search and pagination parameters (page, limit, search term, filters, etc.)

## Implementation Details

### Redis Cache Utility (`src/libs/redisCache.ts`)

The cache utility provides the following functions:

#### 1. `generateCacheKey(baseKey: string, params: Record<string, any>): string`
Generates unique cache keys based on operation type and parameters.

**Usage:**
```typescript
const cacheKey = generateCacheKey("search:chefs", {
  restaurantId: 1,
  search: "John",
  page: 1,
  limit: 10,
  isActive: true
});
// Output: search:chefs:isActive:true|limit:10|page:1|restaurantId:1|search:"John"
```

#### 2. `getCachedData<T>(key: string): Promise<T | null>`
Retrieves cached data from Redis.

**Returns:**
- `T` - The cached data if found and valid
- `null` - If cache miss or error occurs

#### 3. `setCachedData<T>(key: string, data: T): Promise<boolean>`
Stores data in Redis with 3-minute expiration.

**Returns:**
- `true` - Cache set successfully
- `false` - Error during caching (still returns data from API)

#### 4. `invalidateCache(key: string): Promise<boolean>`
Deletes a specific cache entry.

#### 5. `invalidateCacheByPattern(pattern: string): Promise<number>`
Deletes multiple cache entries matching a pattern.

**Usage:**
```typescript
// Clear all chef search caches
await invalidateCacheByPattern("search:chefs:*");

// Clear all pagination caches
await invalidateCacheByPattern("paginate:*");
```

## Updated Functions

### Search Functions

1. **`searchChefs()`** - `src/controller/staff/chef/searchChefs.ts`
   - Caches by: restaurantId, search, page, limit, isActive

2. **`searchWaiters()`** - `src/controller/staff/order_taker/searchWaiters.ts`
   - Caches by: restaurantId, search, page, limit, isActive

3. **`searchMenuItems()`** - `src/controller/menu-itms/admin/searchMenuItems.ts`
   - Caches by: restaurantId, search, page, limit, isActive

4. **`searchArticle()`** - `src/controller/article/searchArticle.ts`
   - Caches by: keyword

### Pagination Functions

1. **`paginateChefs()`** - `src/controller/staff/chef/paginateChefs.ts`
   - Caches by: restaurantId, page, limit

2. **`paginateWaiters()`** - `src/controller/staff/order_taker/paginateWaiters.ts`
   - Caches by: restaurantId, page, limit

3. **`paginateMenuItems()`** - `src/controller/menu-itms/admin/paginateMenuItems.ts`
   - Caches by: restaurantId, page, limit

## Cache Flow Diagram

```
API Request
    ↓
Generate Cache Key
    ↓
Check Redis Cache
    ├─ Cache Hit → Return Cached Data ✓
    │
    └─ Cache Miss
        ↓
    Query Database
        ↓
    Store in Redis (3 min TTL)
        ↓
    Return Data to Client
```

## Benefits

1. **Reduced Database Load**: Repetitive queries within 3 minutes hit the cache instead of the database
2. **Faster Response Times**: Redis lookups are significantly faster than database queries
3. **Improved Scalability**: Fewer database connections needed
4. **Cost Efficient**: Reduces infrastructure strain during peak usage

## Example Usage

### Without Cache (Before)
```
Request 1: Admin searches "John" → Database query (500ms)
Request 2 (within 30s): Admin searches "John" again → Database query (500ms) ❌
Request 3 (within 2m): Admin searches "John" again → Database query (500ms) ❌
Total Time: 1500ms
```

### With Cache (After)
```
Request 1: Admin searches "John" → Database query (500ms) → Cache stored
Request 2 (within 30s): Admin searches "John" again → Cache hit (5ms) ✓
Request 3 (within 2m): Admin searches "John" again → Cache hit (5ms) ✓
Total Time: 510ms (66% faster!) ⚡
```

## Manual Cache Invalidation

If you need to manually clear caches (e.g., after creating/updating/deleting data):

```typescript
import { invalidateCacheByPattern } from "../libs/redisCache.ts";

// When a chef is updated/deleted
await invalidateCacheByPattern("search:chefs:*");
await invalidateCacheByPattern("paginate:chefs:*");

// When a menu item is updated/deleted
await invalidateCacheByPattern("search:menu_items:*");
await invalidateCacheByPattern("paginate:menu_items:*");

// When a waiter is updated/deleted
await invalidateCacheByPattern("search:waiters:*");
await invalidateCacheByPattern("paginate:waiters:*");

// When an article is updated/deleted
await invalidateCacheByPattern("search:articles:*");
```

## Environment Configuration

Ensure your Redis connection is properly configured in `.env`:

```env
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
REDIS_URL=127.0.0.1
REDIS_PORT=6379
```

## Monitoring

To monitor cached data:

```bash
# Connect to Redis
redis-cli

# Get all cache keys
KEYS search:*
KEYS paginate:*

# View a specific cache entry
GET "search:chefs:isActive:true|limit:10|page:1|restaurantId:1"

# Get cache statistics
INFO stats
```

## Performance Metrics

Expected improvements when caching is active:

| Operation | Without Cache | With Cache | Improvement |
|-----------|--------------|-----------|-------------|
| First Request | ~500ms | ~500ms | N/A |
| Repeated Request (same params) | ~500ms | ~5ms | 99% faster |
| Database Load | 100% | ~15-20% | 80-85% reduction |

## Troubleshooting

### Cache Not Working
1. Verify Redis is running: `redis-cli ping` → should return `PONG`
2. Check `.env` configuration for Redis credentials
3. Enable debug logging to see cache hits/misses

### Clear All Caches
```typescript
// Clear everything (use with caution!)
await invalidateCacheByPattern("search:*");
await invalidateCacheByPattern("paginate:*");
```

## Future Enhancements

1. **Cache Warming**: Pre-load popular searches at application startup
2. **Adaptive TTL**: Different TTLs based on data change frequency
3. **Cache Analytics**: Track hit/miss ratios for optimization
4. **Distributed Caching**: Support for Redis clusters in production
5. **Cache Invalidation Events**: Automatic cache clearing on data mutations via webhooks
