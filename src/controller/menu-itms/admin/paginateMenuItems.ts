import prisma from "../../../libs/prisma.ts";
import {
  generateCacheKey,
  getCachedData,
  setCachedData,
} from "../../../libs/redisCache.ts";
import { PaginateParams } from "../../../shared/index.ts";
export async function paginateMenuItems({
  restaurantId,
  page = 1,
  limit = 10,
  cursorId,
}: PaginateParams & { cursorId?: number }) {
  const cacheKey = generateCacheKey("paginate:menu_items", {
    restaurantId,
    page,
    limit,
    cursorId: cursorId ?? "first",
  });

  const cachedResult = await getCachedData(cacheKey);
  if (cachedResult) return cachedResult;

  const where: any = { restaurantId };
  if (cursorId) {
    where.id = { gt: cursorId };
  }

  const items = await prisma.menuItem.findMany({
    where,
    take: limit,
    orderBy: { id: "asc" },
  });

  const total = await prisma.menuItem.count({ where: { restaurantId } });

  const result = {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      lastId: items[items.length - 1]?.id ?? null,
    },
  };

  await setCachedData(cacheKey, result);

  return result;
}
