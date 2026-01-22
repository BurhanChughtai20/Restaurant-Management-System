import prisma from "../../libs/prisma.ts";
import { DeleteOrderTakerBody } from "../../shared/index.ts";

export const deleteOrderTakerConnection = async ({
  orderTakerId,
  restaurantId,
}: DeleteOrderTakerBody & { restaurantId: number }) => {

  const authorized = await prisma.users.findFirst({
    where: {
      id: orderTakerId,
      restaurantId,
      userRoles: { some: { role: "Order_Taker" } },
    },
    select: { id: true }, 
  });

  if (!authorized) {
    throw new Error("Unauthorized - Order Taker not in your restaurant");
  }
  try {
    await prisma.waiterConnection.delete({
      where: { orderTakerId },
    });
  } catch {
    throw new Error("Order Taker connection not found");
  }

  return { message: "Order Taker connection deleted successfully" };
};
