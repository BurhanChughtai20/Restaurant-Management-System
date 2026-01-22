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
  page=1,
  limit=10,
  isActive,
}: SearchChefParams) {
  const cacheKey = generateCacheKey("search:chefs", {
    restaurantId,
    search,
    page,
    limit,
    isActive,
  });

  const cachedResult = await getCachedData<any[]>(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

   const where: any = {
    waiter: {
      restaurantId,
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
  };

  const chefsSearch = await prisma.waiterConnection.findMany({
    where,
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { id: "asc" },
  });

  await setCachedData(cacheKey, chefsSearch);

  return chefsSearch;
}
