import prisma from "../../../libs/prisma.ts";
import { CreateOrderInput } from "../../../shared/index.ts";

export async function createOrder({
  restaurantId,
  orderTakerId,
  items,
}: CreateOrderInput) {
  if (!items.length) throw new Error("Order must have at least one item");
 
  const orderTaker = await prisma.users.findFirst({
    where: {
      id: orderTakerId,
      restaurantId,
      userRoles: { some: { role: "Order_Taker" } },
    },
  });

  if (!orderTaker) {
    throw new Error("Unauthorized - Order Taker not in your restaurant");
  }

  let totalAmount = 0;

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        restaurantId, // 🔥 Set restaurantId
        orderTakerId,
        status: "PENDING",
        totalAmount: 0,
      },
    });

    const orderItemsData = await Promise.all(
      items.map(async (item) => {
        const menuItem = await tx.menuItem.findFirst({
          where: {
            id: item.menuItemId,
            restaurantId, // 🔥 Ensure menu item belongs to restaurant
          },
        });

        if (!menuItem) {
          throw new Error(
            `Menu item ${item.menuItemId} not found in your restaurant`
          );
        }

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
