import prisma from "../../../libs/prisma.ts";

interface OrderItemUpdateInput {
  menuItemId: number;
  quantity: number;
}

interface UpdateOrderInput {
  orderId: number;
  items: OrderItemUpdateInput[];
}

interface OrderChangeMessage {
  type: "ADDED" | "UPDATED" | "REMOVED";
  message: string;
}

export async function updateOrder({ orderId, items }: UpdateOrderInput) {
  const changeLogs: OrderChangeMessage[] = [];
  let totalAmount = 0;

  const updatedOrder = await prisma.$transaction(async (tx) => {
    // ⚡ Select all needed fields
    const existingItems = await tx.orderItem.findMany({
      where: { orderId },
      select: {
        id: true,
        menuItemId: true,
        name: true,
        description: true,
        quantity: true,
        price: true,
        total: true,
      },
    });

    const existingMap = new Map(existingItems.map(item => [item.menuItemId, item]));

    for (const item of items) {
      const menuItem = await tx.menuItem.findUniqueOrThrow({ where: { id: item.menuItemId } });
      const total = menuItem.price * item.quantity;
      totalAmount += total;

      if (existingMap.has(item.menuItemId)) {
        const existing = existingMap.get(item.menuItemId)!;
        if (existing.quantity !== item.quantity) {
          changeLogs.push({
            type: "UPDATED",
            message: `${menuItem.name} quantity updated from ${existing.quantity} → ${item.quantity}`,
          });
        }

        await tx.orderItem.update({
          where: { id: existing.id },
          data: { quantity: item.quantity, total },
        });

        existingMap.delete(item.menuItemId);
      } else {
        changeLogs.push({
          type: "ADDED",
          message: `${menuItem.name} added (qty: ${item.quantity})`,
        });

        await tx.orderItem.create({
          data: {
            orderId,
            menuItemId: menuItem.id,
            name: menuItem.name,
            description: menuItem.description,
            quantity: item.quantity,
            price: menuItem.price,
            total,
          },
        });
      }
    }

    for (const removed of existingMap.values()) {
      changeLogs.push({
        type: "REMOVED",
        message: `${removed.name} removed`,
      });
      await tx.orderItem.delete({ where: { id: removed.id } });
    }

    return tx.order.update({
      where: { id: orderId },
      data: { totalAmount },
      include: { items: true },
    });
  });

  return { order: updatedOrder, changes: changeLogs };
}
