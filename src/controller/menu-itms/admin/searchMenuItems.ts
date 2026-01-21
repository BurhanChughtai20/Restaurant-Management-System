import prisma from "../../../libs/prisma.ts";
import { getCachedData, setCachedData } from "../../../libs/redisCache.ts";
import { SearchMenuItemsParams } from "../../../shared/index.ts";

export async function searchMenuItems({
  restaurantId,
  search,
  page,
  limit,
  isActive,
}: SearchMenuItemsParams) {
  const cacheKey = [
    "search:menu_items",
    `restaurant:${restaurantId}`,
    `search:${search || "all"}`,
    `page:${page}`,
    `limit:${limit}`,
    `active:${isActive ?? "all"}`,
  ].join("|");

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