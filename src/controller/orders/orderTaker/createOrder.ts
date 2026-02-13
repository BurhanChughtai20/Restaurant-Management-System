import { OrderStatus } from "@prisma/client";
import prisma from "../../../libs/prisma.ts";
import type { CreateOrderInput, Order, OrderItem } from "../../../shared/index.ts";
import { formatToTimezone } from "../../../utils/formatTime.ts";

export async function createOrder({
  restaurantId,
  orderTakerId,
  items,
  timezone,
}: CreateOrderInput & { timezone?: string }): Promise<Order & { createdAtTime: string }> {

  if (!items.length) throw new Error("Order must have at least one item");

  const orderTaker = await prisma.users.findFirst({
    where: { id: orderTakerId, restaurantId, userRoles: { some: { role: "Order_Taker" } } },
  });
  if (!orderTaker) throw new Error("Unauthorized");

  const mergedItems: Record<number, number> = {};
  items.forEach(item => {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0)
      throw new Error(`Invalid quantity for menuItem ${item.menuItemId}`);
    mergedItems[item.menuItemId] = (mergedItems[item.menuItemId] || 0) + item.quantity;
  });

  const menuItemIds = Object.keys(mergedItems).map(id => parseInt(id, 10));
  const menuItems = await prisma.menuItem.findMany({ where: { id: { in: menuItemIds }, restaurantId } });

  let totalAmount = 0;
  const createdOrder = await prisma.$transaction(async tx => {
    const newOrder = await tx.order.create({
      data: { restaurantId, orderTakerId, status: OrderStatus.PENDING, totalAmount: 0 },
    });

    const orderItemsData: OrderItem[] = [];
    for (const menuItem of menuItems) {
      const quantity = mergedItems[menuItem.id]!;
      const total = menuItem.price * quantity;
      totalAmount += total;

      const created = await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          menuItemId: menuItem.id,
          name: menuItem.name,
          description: menuItem.description ?? null,
          quantity,
          price: menuItem.price,
          total,
        },
      });

      orderItemsData.push({
        id: created.id,
        name: created.name,
        description: created.description,
        quantity: created.quantity,
        price: created.price,
        total: created.total,
      });
    }

    await tx.order.update({ where: { id: newOrder.id }, data: { totalAmount } });

    return { newOrder, orderItemsData };
  });

  return {
    id: createdOrder.newOrder.id,
    items: createdOrder.orderItemsData,
    createdAtTime: formatToTimezone(createdOrder.newOrder.createdAt, timezone),
  };
}
