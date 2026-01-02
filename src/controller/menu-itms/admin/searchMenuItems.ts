import prisma from "../../../libs/prisma.ts";
import {
  generateCacheKey,
  getCachedData,
  setCachedData,
} from "../../../libs/redisCache.ts";

interface SearchMenuItemsParams {
  restaurantId: number; // ✅ REQUIRED
  search?: string;
  page: number;
  limit: number;
  isActive?: boolean;
}

export async function searchMenuItems({
  restaurantId,
  search,
  page,
  limit,
  isActive,
}: SearchMenuItemsParams) {
  // Generate cache key based on search parameters
  const cacheKey = generateCacheKey("search:menu_items", {
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
    restaurantId, // 🔐 restaurant isolation
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const [items, total] = await Promise.all([
    prisma.menuItem.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "desc" },
    }),

    prisma.menuItem.count({
      where,
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
