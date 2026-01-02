import prisma from "../../libs/prisma.ts";

interface UpdateOrderTakerParams {
  restaurantId: number;
  orderTakerId: number;
  fromTime?: string;
  toTime?: string;
}

export const updateOrderTakerConnection = async ({
  restaurantId,
  orderTakerId,
  fromTime,
  toTime,
}: UpdateOrderTakerParams) => {
  // 🔥 Verify order taker belongs to the restaurant
  const orderTaker = await prisma.users.findFirst({
    where: {
      id: orderTakerId,
      restaurantId,
      userRoles: {
        some: { role: "Order_Taker" },
      },
    },
  });

  if (!orderTaker) {
    throw new Error("Unauthorized - Order Taker not in your restaurant");
  }

  const connection = await prisma.waiterConnection.findUnique({
    where: { orderTakerId },
  });

  if (!connection) {
    throw new Error("Order Taker connection not found");
  }

  const updatedConnection = await prisma.waiterConnection.update({
    where: { orderTakerId },
    data: {
      fromTime: fromTime ?? connection.fromTime,
      toTime: toTime ?? connection.toTime,
    },
  });

  return updatedConnection;
};
