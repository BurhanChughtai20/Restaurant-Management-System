import prisma from "../../../libs/prisma.ts";

export async function getMenuItemsForOrderTaker(restaurantId: number) {
  return prisma.menuItem.findMany({
    where: {
      restaurantId, // 🔥 Ensure restaurant isolation
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      price: true,
      description: true,
      sku: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}
