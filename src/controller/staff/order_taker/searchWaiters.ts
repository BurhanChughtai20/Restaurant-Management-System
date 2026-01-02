import prisma from "../../../libs/prisma.ts";
import {
  generateCacheKey,
  getCachedData,
  setCachedData,
} from "../../../libs/redisCache.ts";

interface SearchWaitersParams {
  restaurantId: number;
  search?: string;
  page: number;
  limit: number;
  isActive?: boolean | undefined;
}

export async function searchWaiters({
  restaurantId,
  search,
  page,
  limit,
  isActive,
}: SearchWaitersParams) {
  // Generate cache key based on search parameters
  const cacheKey = generateCacheKey("search:waiters", {
    restaurantId,
    search,
    page,
    limit,
    isActive,
  });

  // Check if data exists in Redis cache
  const cachedResult = await getCachedData(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  const skip = (page - 1) * limit;

  const where: any = {
    waiter: {
      restaurantId, // 🔥 Ensure restaurant isolation
    },
  };

  if (search) {
    where.waiter = {
      ...where.waiter,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

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
