import prisma from "../../../libs/prisma.ts";
import { 
  CreateOrderInput, 
  Order, 
  OrderItem, 
  OrderItemInput 
} from "../../../shared/index.ts";
import { OrderStatus } from "@prisma/client";
export async function createOrder({
  restaurantId,
  orderTakerId,
  items,
}: CreateOrderInput): Promise<Order> {

  if (!items.length) {
    throw new Error("Order must have at least one item");
  }

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

  const createdOrder = await prisma.$transaction(async (tx) => {

    const newOrder = await tx.order.create({
      data: {
        restaurantId,
        orderTakerId,
        status: OrderStatus.PENDING,
        totalAmount: 0,
      },
    });

    const createOrderItem = async (item: OrderItemInput) => {
      const menuItem = await tx.menuItem.findFirst({
        where: { id: item.menuItemId, restaurantId },
      });

      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found in this restaurant`);
      }

      const total = menuItem.price * item.quantity;
      totalAmount += total;

      const created = await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          menuItemId: menuItem.id,
          name: menuItem.name,
          description: menuItem.description ?? null,
          quantity: item.quantity,
          price: menuItem.price,
          total,
        },
      });

      return {
        id: created.id,
        name: created.name,
        description: created.description,
        quantity: created.quantity,
        price: created.price,
        total: created.total,
      } as OrderItem;
    };

    const orderItemsData: OrderItem[] = await Promise.all(
      items.map(item => createOrderItem(item))
    );

    await tx.order.update({
      where: { id: newOrder.id },
      data: { totalAmount },
    });

    return {
      id: newOrder.id,
      items: orderItemsData,
    } as Order;

  });

  return createdOrder;
}
