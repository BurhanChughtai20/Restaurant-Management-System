import prisma from "../../../libs/prisma.ts";
import type { OrderItem } from "../../../shared/index.ts";
const menuCache = new Map<number, { data: any; timestamp: number }>();
const cacheDuration = 5 * 60 * 1000;

export async function getMenuItemsForOrderTaker(restaurantId: number): Promise<OrderItem[]> {
  if (!restaurantId || restaurantId <= 0) {
    return [];
  }
  const now = Date.now();
  const cached = menuCache.get(restaurantId);
  if (cached && now - cached.timestamp < cacheDuration) {
    return cached.data;
  }
  const result = await prisma.menuItem.findMany({
    where: {
      restaurantId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      description: true,
      quantity: true,
      price: true,
    },
    orderBy: { name: "asc" },
  });
  menuCache.set(restaurantId, { data: result, timestamp: now });
  return result;
}
