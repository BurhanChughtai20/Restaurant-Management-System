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

export async function paginateChefs({
  restaurantId,
  page,
  limit,
}: PaginateParams) {
  // Generate cache key based on pagination parameters
  const cacheKey = generateCacheKey("paginate:chefs", {
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
    chef: {
      restaurantId, // 🔥 Ensure restaurant isolation
    },
  };

  const [chefs, total] = await Promise.all([
    prisma.chefConnection.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "desc" },
      include: {
        chef: {
          select: { id: true, name: true, email: true, restaurantId: true },
        },
      },
    }),
    prisma.chefConnection.count({ where }),
  ]);

  const result = {
    data: chefs,
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
