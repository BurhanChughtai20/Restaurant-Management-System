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
  const orderTaker = await prisma.users.findFirst({
    where: {
      id: orderTakerId,
      restaurantId,
      userRoles: {
        some: { role: "Order_Taker" },
      },
    },
    select: { id: true },
  });

  if (!orderTaker) {
    throw new Error("Unauthorized - Order Taker not in your restaurant");
  }

  const updatedConnection = await prisma.waiterConnection.update({
    where: { orderTakerId },
    data: {
      ...(fromTime && { fromTime }),
      ...(toTime && { toTime }),
    },
  });

  return updatedConnection;
};
