import prisma from "../../../libs/prisma.ts";
import {
  generateCacheKey,
  getCachedData,
  setCachedData,
} from "../../../libs/redisCache.ts";

interface SearchChefParams {
  restaurantId: number;
  search?: string;
  page: number;
  limit: number;
  isActive?: boolean | undefined;
}

export async function searchChefs({
  restaurantId,
  search,
  page,
  limit,
  isActive,
}: SearchChefParams) {
  // Generate cache key based on search parameters
  const cacheKey = generateCacheKey("search:chefs", {
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
    chef: {
      restaurantId, // 🔥 Ensure restaurant isolation
    },
  };

  if (search) {
    where.chef = {
      ...where.chef,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

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
