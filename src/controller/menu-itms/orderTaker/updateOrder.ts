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
  if (!items || items.length === 0) {
    throw new Error("Order must have at least one item");
  }

  const changeLogs: OrderChangeMessage[] = [];

  const updatedOrder = await prisma.$transaction(async (tx) => {

    const existingItems = await tx.orderItem.findMany({
      where: { orderId },
      select: {
        id: true,
        menuItemId: true,
        quantity: true,
        name: true,
        price: true,
        total: true,
      },
    });

    const existingMap = new Map(
      existingItems.map((item) => [item.menuItemId, item])
    );

    let totalAmount = 0;

    for (const item of items) {
      const menuItem = await tx.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

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
          data: {
            quantity: item.quantity,
            total: itemTotal,
          },
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
            total: itemTotal,
          },
        });
      }
    }

    // 🔴 Removed items
    for (const removed of existingMap.values()) {
      changeLogs.push({
        type: "REMOVED",
        message: `${removed.name} removed`,
      });

      await tx.orderItem.delete({
        where: { id: removed.id },
      });
    }

    // ✅ Update order total
    const order = await tx.order.update({
      where: { id: orderId },
      data: { totalAmount },
      include: { items: true },
    });

    return order;
  });

  return {
    order: updatedOrder,
    changes: changeLogs,
  };
}
