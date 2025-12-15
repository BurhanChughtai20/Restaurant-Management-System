import prisma from "../../../libs/prisma.ts";

interface OrderItemInput {
  menuItemId: number;
  quantity: number;
}

interface CreateOrderInput {
  orderTakerId: number;
  items: OrderItemInput[];
}

export async function createOrder({ orderTakerId, items }: CreateOrderInput) {
  if (!items || items.length === 0) {
    throw new Error("Order must have at least one item");
  }

  let totalAmount = 0;

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderTakerId,
        status: "PENDING",
        totalAmount: 0,
      },
    });

    for (const item of items) {
      const menuItem = await tx.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem) {
        throw new Error(`Menu item with id ${item.menuItemId} not found`);
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          menuItemId: menuItem.id,
          name: menuItem.name,
          description: menuItem.description,
          quantity: item.quantity,
          price: menuItem.price,
          total: menuItem.price * item.quantity,
        },
      });
    }

    return tx.order.update({
      where: { id: newOrder.id },
      data: { totalAmount },
      include: { items: true },
    });
  });

  return order;
}
