import prisma from "../../../libs/prisma.ts";
export interface MenuItemForChef {
  id: number;
  name: string;
  description?: string | null;
  quantity?: number;
  orderId?: number;
};

export async function getMenuItemsForChef(): Promise<MenuItemForChef[]> {
  const twentySecondsAgo = new Date(Date.now() - 60 * 1000);
  const recentOrders = await prisma.order.findMany({
    where: {
      status: "PENDING",
      createdAt: { gte: twentySecondsAgo },
    },
    include: {
      items: {
        select: {
          id: true,
          menuItemId: true,
          name: true,
          description: true,
          quantity: true,
        },
      },
      orderTaker: true,
    },
  });

  const items: MenuItemForChef[] = [];
  for (const order of recentOrders) {
    for (const item of order.items) {
      items.push({
        id: item.menuItemId,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        orderId: order.id,
      });
    }
  }

  return items;
}
