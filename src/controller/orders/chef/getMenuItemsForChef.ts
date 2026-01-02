import prisma from "../../../libs/prisma.ts";

export interface MenuItemForChef {
  id: number;
  name: string;
  description?: string | null;
  quantity?: number;
  orderId?: number;
}

export async function getMenuItemsForChef(
  restaurantId: number
): Promise<MenuItemForChef[]> {
  const twentySecondsAgo = new Date(Date.now() - 60 * 1000);

  const recentOrders = await prisma.order.findMany({
    where: {
      restaurantId, // 🔥 Ensure restaurant isolation
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
  });

  return recentOrders.flatMap((order) =>
    order.items.map((item) => ({
      id: item.menuItemId,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      orderId: order.id,
    }))
  );
}
