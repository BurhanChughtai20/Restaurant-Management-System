import prisma from "../../../libs/prisma.ts";
import { GetOrdersByOrderTakerInput, Order } from "../../../shared/index.ts";

export async function getAllOrdersByOrderTaker(
  input: GetOrdersByOrderTakerInput
): Promise<Order[]> {
  const { restaurantId, orderTakerId } = input;

  const orderTaker = await prisma.users.findFirst({
    where: {
      id: orderTakerId,
      restaurantId,
      userRoles: { some: { role: "Order_Taker" } },
    },
    select: { id: true },
  });

  if (!orderTaker) {
    throw new Error("Unauthorized - Order Taker not in your restaurant");
  }

  const orders = await prisma.order.findMany({
    where: { restaurantId, orderTakerId },
    include: {
      items: {
        include: { menuItem: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders as Order[];
}
