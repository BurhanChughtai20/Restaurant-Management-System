import prisma from "../../libs/prisma.ts";
export const deleteOrderTakerConnection = async ({
  restaurantId,
  orderTakerId,
}: { restaurantId: number; orderTakerId: number }) => {
  const orderTaker = await prisma.users.findFirst({
    where: {
      id: orderTakerId,
      restaurantId,
      userRoles: { some: { role: "Order_Taker" } },
    },
    select: { id: true },
  });

  if (!orderTaker) throw new Error("Unauthorized - Order Taker not in your restaurant");

  try {
    await prisma.waiterConnection.delete({ where: { orderTakerId } });
  } catch {
    throw new Error("Order Taker connection not found");
  }

  return { message: "Order Taker connection deleted successfully" };
};
