import prisma from "../../../libs/prisma.ts";
import { generateCacheKey, getCachedData, setCachedData } from "../../../libs/redisCache.ts";
import type { SearchMenuItemsParams } from "../../../shared/index.ts";

export async function searchMenuItems({
  restaurantId,
  search,
  page,
  limit,
  isActive,
}: SearchMenuItemsParams) {
  const cacheKey = generateCacheKey("search:menu_items", {
    restaurantId,
    search,
    page,
    limit,
    isActive,
  });

  const cachedResult = await getCachedData<string>(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  const where: any = {
    restaurantId,
    ...(isActive !== undefined ? { isActive } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const menuItems = await prisma.menuItem.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { name: "asc" },
  });

  await setCachedData(cacheKey, menuItems);

  return menuItems;
}