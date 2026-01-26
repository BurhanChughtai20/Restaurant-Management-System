import prisma from "../../../libs/prisma.ts";
import type { GetRestaurantIdForChef, MenuItemForChef } from "../../../shared/interfaces/chef.interface.ts";

const twentySecondsAgo = new Date(Date.now() - 20 * 1000);
export async function getMenuItemsForChef(
  restaurant: GetRestaurantIdForChef
): Promise<MenuItemForChef[]> {
  const { restaurantId } = restaurant;

  const recentOrders = await prisma.order.findMany({
    where: {
      restaurantId,
      status: "PENDING",
      createdAt: { gte: twentySecondsAgo },
    },
    include: {
      items: {
        select: {
          menuItemId: true,
          name: true,
          description: true,
          quantity: true,
        } as const,
      },
    },
    orderBy: { createdAt: "desc" },
  });

return recentOrders.reduce<MenuItemForChef[]>((acc, order) => {
  for (const item of order.items) {
    acc.push({
      id: item.menuItemId,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      orderId: order.id,
    });
  }
  return acc;
}, []);

}
