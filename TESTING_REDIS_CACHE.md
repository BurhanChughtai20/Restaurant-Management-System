# Redis Caching - Testing & Verification Guide

## 🧪 Testing the Cache Implementation

This guide helps you verify that Redis caching is working correctly.

---

## ✅ Pre-Test Checklist

- [ ] Redis is running (`redis-cli ping` returns `PONG`)
- [ ] `.env` has Redis credentials configured
- [ ] Application started successfully
- [ ] No Redis connection errors in console logs

---

## 🧪 Test 1: Cache Hit Detection

### Scenario: Repeated requests should be faster

#### Using `curl`
```bash
# Request 1 - First time (will hit database)
time curl "http://localhost:3000/admin/chefs/search?page=1&limit=10&restaurantId=1"

# Note the response time, e.g., ~500ms

# Request 2 - Same parameters (should hit cache)
time curl "http://localhost:3000/admin/chefs/search?page=1&limit=10&restaurantId=1"

# Response time should be ~5-10ms (99% faster) ✓
```

#### Expected Results
```
Request 1: ~500ms (database hit + cache write)
Request 2: ~5-10ms (cache hit) ✓

Time difference: ~495ms faster
Improvement: ~99% ✓
```

---

## 🧪 Test 2: Cache Miss with Different Parameters

### Scenario: Different parameters = different cache key = cache miss

#### Using `curl`
```bash
# Request 1
curl "http://localhost:3000/admin/chefs/search?page=1&limit=10&restaurantId=1"
# Response time: ~500ms

# Request 2 - Different page
curl "http://localhost:3000/admin/chefs/search?page=2&limit=10&restaurantId=1"
# Response time: ~500ms (cache miss - different cache key) ✓

# Request 3 - Different search term
curl "http://localhost:3000/admin/chefs/search?page=1&limit=10&restaurantId=1&search=John"
# Response time: ~500ms (cache miss - different cache key) ✓

# Request 4 - Back to Request 1 parameters
curl "http://localhost:3000/admin/chefs/search?page=1&limit=10&restaurantId=1"
# Response time: ~5-10ms (cache hit) ✓
```

#### Expected Results
```
Different parameters = Different cache keys
Each unique parameter set = New database query
Repeated identical parameters = Cache hit ✓
```

---

## 🧪 Test 3: Cache Expiration (3-Minute TTL)

### Scenario: Cache should expire after 3 minutes

#### Steps
1. Make a request
2. Verify it's cached (fast response)
3. Wait 3+ minutes
4. Make the same request again
5. Should be slow (database hit) - cache expired ✓

#### Using `curl`
```bash
# Request 1 - 00:00
time curl "http://localhost:3000/admin/chefs/search?page=1&limit=10&restaurantId=1"
# ~500ms (database hit)

# Request 2 - 00:30 (within 3 minutes)
time curl "http://localhost:3000/admin/chefs/search?page=1&limit=10&restaurantId=1"
# ~5-10ms (cache hit) ✓

# WAIT 2:30 MINUTES (total elapsed: 3:00)

# Request 3 - 03:00+ (cache expired)
time curl "http://localhost:3000/admin/chefs/search?page=1&limit=10&restaurantId=1"
# ~500ms (database hit - cache expired) ✓
```

---

## 🧪 Test 4: Multiple Endpoints Caching

### Verify different endpoints use different caches

```bash
# Chef Search
curl "http://localhost:3000/admin/chefs/search?page=1&limit=10&restaurantId=1"

# Chef Pagination
curl "http://localhost:3000/admin/chefs/paginate?page=1&limit=10&restaurantId=1"

# Menu Items Search
curl "http://localhost:3000/admin/menu-items/search?page=1&limit=10&restaurantId=1"

# Menu Items Pagination
curl "http://localhost:3000/admin/menu-items/paginate?page=1&limit=10&restaurantId=1"

# Waiters Search
curl "http://localhost:3000/admin/waiters/search?page=1&limit=10&restaurantId=1"

# Waiters Pagination
curl "http://localhost:3000/admin/waiters/paginate?page=1&limit=10&restaurantId=1"

# Articles Search
curl "http://localhost:3000/admin/articles/search?keyword=test"

# Subsequent calls to same endpoints should be fast
```

---

## 🧪 Test 5: Redis Cache Inspection

### Verify cache entries exist in Redis

#### Check all cache keys
```bash
redis-cli
> KEYS "*"
```

Expected output:
```
search:chefs:limit:10|page:1|restaurantId:1
search:waiters:limit:10|page:1|restaurantId:1
search:menu_items:limit:10|page:1|restaurantId:1
paginate:chefs:limit:10|page:1|restaurantId:1
... more keys ...
```

#### Check specific cache entry
```bash
redis-cli GET "search:chefs:limit:10|page:1|restaurantId:1"
```

Expected output: JSON data with chefs and pagination info

#### Check TTL of a key
```bash
redis-cli TTL "search:chefs:limit:10|page:1|restaurantId:1"
```

Expected output: A number between 0-180 (seconds remaining)

---

## 🧪 Test 6: Cache Invalidation

### Verify cache can be manually cleared

```bash
# Create a chef (should cache search results)
curl -X POST "http://localhost:3000/admin/chefs" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Chef","email":"test@example.com","restaurantId":1}'

# Clear cache manually
redis-cli EVAL "return redis.call('del', unpack(redis.call('keys', ARGV[1])))" 0 "search:chefs:*"

# Check keys are gone
redis-cli KEYS "search:chefs:*"
# Should return empty

# Next search will hit database (no cache)
```

---

## 📊 Test 7: Load Test (Optional)

### Simulate multiple requests to measure performance

#### Using Apache Bench (if installed)
```bash
# Baseline (no cache warmup)
ab -n 100 -c 10 "http://localhost:3000/admin/chefs/search?page=1&limit=10&restaurantId=1"

# After cache warmup
ab -n 100 -c 10 "http://localhost:3000/admin/chefs/search?page=1&limit=10&restaurantId=1"
```

Expected improvement on second run: ~90% faster

#### Using Postman Collection Runner
1. Create requests for each endpoint
2. Run collection multiple times
3. Compare response times

---

## 🐛 Debugging Failed Cache

### Check Console Logs
```
✓ Cache hit message: "Cache hit for key: search:chefs:..."
✓ Cache set message: "Cache stored for key: search:chefs:..."
✗ Cache error: "Error retrieving cache..."
```

### Verify Redis Connection
```bash
redis-cli ping
# Should return: PONG

redis-cli info server
# Should show version and uptime
```

### Check Environment Variables
```bash
# Verify Redis config in .env
cat .env | grep REDIS_

# Or in Node.js:
console.log({
  username: process.env.REDIS_USERNAME,
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT
});
```

---

## 📋 Manual Test Checklist

Create your test checklist and mark as you go:

```bash
[ ] Test 1: Cache Hit - Repeated requests faster
[ ] Test 2: Cache Miss - Different parameters slower  
[ ] Test 3: TTL - Cache expires after 3 minutes
[ ] Test 4: Multiple Endpoints - All caching correctly
[ ] Test 5: Redis Inspection - Cache entries visible
[ ] Test 6: Cache Invalidation - Manual clear works
[ ] Test 7: Performance - Load test shows improvement

All Passed? ✅ Ready for Production!
```

---

## 🎯 Expected Test Results Summary

| Test | Expected Result | Status |
|------|-----------------|--------|
| Cache Hit | <20ms response | ✅ |
| Cache Miss | ~500ms response | ✅ |
| TTL Expiration | Cache expires after 180s | ✅ |
| Multiple Endpoints | Each has own cache | ✅ |
| Redis Keys | Visible in `KEYS *` | ✅ |
| Manual Clear | Keys deleted | ✅ |
| Load Test | 80%+ performance gain | ✅ |

---

## 🚨 Common Issues & Solutions

### Issue: All requests are slow (no caching)
**Solution:**
1. Check Redis is running: `redis-cli ping`
2. Check `.env` Redis credentials
3. Check console for connection errors
4. Restart application

### Issue: Cache keys not appearing in Redis
**Solution:**
1. Verify first request succeeded: `curl http://localhost:3000/...`
2. Run `redis-cli KEYS "*"` immediately after
3. If still nothing, check error logs
4. Verify RedisClient is connected

### Issue: Cache TTL not working
**Solution:**
1. Check `CACHE_EXPIRATION` in `src/libs/redisCache.ts`
2. Verify `setEx()` is being called correctly
3. Check Redis version supports `setEx()`

### Issue: Manual cache clear not working
**Solution:**
1. Verify pattern syntax: `"search:chefs:*"` (with asterisk)
2. Check Redis has keys: `redis-cli KEYS "search:chefs:*"`
3. Verify function is imported correctly

---

## 📈 Performance Benchmarking

### Create a benchmark script:
```typescript
// benchmark.ts
import { performance } from 'perf_hooks';
import { searchChefs } from './src/controller/staff/chef/searchChefs.ts';

async function benchmark() {
  const params = {
    restaurantId: 1,
    page: 1,
    limit: 10,
  };

  // First call (no cache)
  const start1 = performance.now();
  await searchChefs(params);
  const time1 = performance.now() - start1;
  console.log(`First call: ${time1.toFixed(2)}ms`);

  // Second call (cached)
  const start2 = performance.now();
  await searchChefs(params);
  const time2 = performance.now() - start2;
  console.log(`Second call: ${time2.toFixed(2)}ms`);

  // Calculate improvement
  const improvement = ((time1 - time2) / time1 * 100).toFixed(1);
  console.log(`Improvement: ${improvement}%`);
}

benchmark();
```

---

## ✅ Final Verification

Run this to confirm everything is working:

```bash
# 1. Check Redis
redis-cli ping

# 2. Check app logs for connection
npm run dev

# 3. Make test request
curl "http://localhost:3000/admin/chefs/search?page=1&limit=10&restaurantId=1"

# 4. Verify cache entry
redis-cli KEYS "search:chefs:*"

# 5. Repeat request (should be faster)
curl "http://localhost:3000/admin/chefs/search?page=1&limit=10&restaurantId=1"

# All working? ✅ Caching is active!
```

---

**Ready to Test?** Start with Test 1 above! ⚡

