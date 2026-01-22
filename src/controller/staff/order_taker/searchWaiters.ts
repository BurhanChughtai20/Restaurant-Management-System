import prisma from "../../../libs/prisma.ts";
import {
  generateCacheKey,
  getCachedData,
  setCachedData,
} from "../../../libs/redisCache.ts";
import { SearchOrderTakerParams } from "../../../shared/index.ts";

export async function searchWaiters({
  restaurantId,
  search,
  page = 1,
  limit = 10,
  isActive,
}: SearchOrderTakerParams) {

  const cacheKey = generateCacheKey("search:waiters", {
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

  const waiterSearch = await prisma.waiterConnection.findMany({
    where,
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { id: "asc" },
  });

  await setCachedData(cacheKey, waiterSearch);

  return waiterSearch;
}
