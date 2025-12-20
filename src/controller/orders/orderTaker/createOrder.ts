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
  if (!items.length) throw new Error("Order must have at least one item");

  let totalAmount = 0;

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: { orderTakerId, status: "PENDING", totalAmount: 0 },
    });

    const orderItemsData = await Promise.all(
      items.map(async (item) => {
        const menuItem = await tx.menuItem.findUniqueOrThrow({
          where: { id: item.menuItemId },
        });

        const total = menuItem.price * item.quantity;
        totalAmount += total;

        return tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            menuItemId: menuItem.id,
            name: menuItem.name,
            description: menuItem.description,
            quantity: item.quantity,
            price: menuItem.price,
            total,
          },
        });
      })
    );

    return tx.order.update({
      where: { id: newOrder.id },
      data: { totalAmount },
      include: { items: true },
    });
  });

  return order;
}
