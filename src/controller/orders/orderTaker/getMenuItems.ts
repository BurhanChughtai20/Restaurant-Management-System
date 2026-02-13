import prisma from "../../../libs/prisma.ts";
import type { MenuItemForMobile } from "../../../shared/index.ts";
import { ApiError } from "../../../utils/ApiError.ts";

interface CachedMenu {
  data: MenuItemForMobile[];
  timestamp: number;
  maxCreatedAt: Date;
}

const menuCache = new Map<number, CachedMenu>();

export async function getMenuItemsForOrderTaker(
  restaurantId: number
): Promise<MenuItemForMobile[]> {
  if (!restaurantId || typeof restaurantId !== "number") {
    throw new ApiError(400, "Invalid restaurant context");
  }

  const now = Date.now();
  const cached = menuCache.get(restaurantId);

  // Step 1: Get max createdAt from DB
  const latestItem = await prisma.menuItem.findFirst({
    where: { restaurantId, isActive: true },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  const latestCreatedAt = latestItem?.createdAt;

  // Step 2: If cache exists and no new items, return cache
  if (cached && latestCreatedAt && latestCreatedAt <= cached.maxCreatedAt) {
    return cached.data;
  }

  // Step 3: Fetch all active items
  const items = await prisma.menuItem.findMany({
    where: { restaurantId, isActive: true },
    select: { id: true, name: true, description: true, price: true, sku: true },
    orderBy: { name: "asc" },
  });

  // Step 4: Update cache
  menuCache.set(restaurantId, {
    data: items,
    timestamp: now,
    maxCreatedAt: latestCreatedAt ?? new Date(0),
  });

  return items;
}
