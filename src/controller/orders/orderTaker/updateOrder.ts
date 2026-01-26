import prisma from "../../../libs/prisma.ts";
import type { OrderChangeMessage, OrderItem, UpdateOrderInput } from "../../../shared/index.ts";

export async function updateOrder({
  restaurantId,
  orderId,
  items,
}: UpdateOrderInput): Promise<{ orderItems: OrderItem[]; changeLogs: OrderChangeMessage[] }> {
  const changeLogs: OrderChangeMessage[] = [];
  let totalAmount = 0;

  const updatedOrderItems = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id: orderId, restaurantId },
      include: {
        items: {
          select: {
            id: true,
            menuItemId: true,
            name: true,
            description: true,
            price: true,
            quantity: true,
            total: true,
          },
        },
      },
    });

    if (!order) throw new Error("Order not found");

    const mapItems: Map<number, typeof order.items[0]> = new Map(
      order.items.map((item) => [item.menuItemId, item])
    );

    for (const newItem of items) {
  if (mapItems.has(newItem.menuItemId)) {
  } else {
    const menuItem = await tx.menuItem.findUnique({ where: { id: newItem.menuItemId } });
    if (!menuItem) throw new Error("Menu item not found");

    await tx.orderItem.create({
      data: {
        orderId,
        menuItemId: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        quantity: newItem.quantity,
        total: menuItem.price * newItem.quantity,
      },
    });
  }
}
    const newMenuItemIds = new Set(items.map((i) => i.menuItemId));

    for (const [menuItemId, existingItem] of mapItems.entries()) {
      if (!newMenuItemIds.has(menuItemId)) {
        await tx.orderItem.delete({ where: { id: existingItem.id } });
        totalAmount -= existingItem.total;

        changeLogs.push({
          type: "REMOVED",
          message: `${existingItem.name} removed`,
        });
      }
    }

    await tx.order.update({
      where: { id: orderId },
      data: { totalAmount },
    });

    return tx.orderItem.findMany({ where: { orderId } });
  });

  return { orderItems: updatedOrderItems, changeLogs };
}
