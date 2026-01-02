import prisma from "../../../libs/prisma.ts";
import {
  generateCacheKey,
  getCachedData,
  setCachedData,
} from "../../../libs/redisCache.ts";

interface PaginateParams {
  restaurantId: number; // ✅ ADD THIS
  page: number;
  limit: number;
}

export async function paginateMenuItems({
  restaurantId,
  page,
  limit,
}: PaginateParams) {
  // Generate cache key based on pagination parameters
  const cacheKey = generateCacheKey("paginate:menu_items", {
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

  const [items, total] = await Promise.all([
    prisma.menuItem.findMany({
      where: {
        restaurantId, // 🔐 data isolation
      },
      skip,
      take: limit,
      orderBy: { id: "desc" },
    }),

    prisma.menuItem.count({
      where: {
        restaurantId, // 🔐 same filter
      },
    }),
  ]);

  const result = {
    data: items,
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
