import prisma from "../../../libs/prisma.ts";
import {
  generateCacheKey,
  getCachedData,
  setCachedData,
} from "../../../libs/redisCache.ts";

interface PaginateParams {
  restaurantId: number;
  page: number;
  limit: number;
}

export async function paginateWaiters({
  restaurantId,
  page,
  limit,
}: PaginateParams) {
  // Generate cache key based on pagination parameters
  const cacheKey = generateCacheKey("paginate:waiters", {
    restaurantId,
    page,
    limit,
  });

  // Check if data exists in Redis cache
  const cachedResult = await getCachedData(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  const skip = (page - 1) * limit;

  const where = {
    waiter: {
      restaurantId, // 🔥 Ensure restaurant isolation
    },
  };

  const [waiters, total] = await Promise.all([
    prisma.waiterConnection.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "desc" },
      include: {
        waiter: {
          select: { id: true, name: true, email: true, restaurantId: true },
        },
      },
    }),

    prisma.waiterConnection.count({ where }),
  ]);

  const result = {
    data: waiters,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  // Cache the result for 3 minutes
  await setCachedData(cacheKey, result);

  return result;
}
