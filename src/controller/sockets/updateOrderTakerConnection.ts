import prisma from "../../libs/prisma.ts";
import type { UpdateOrderTakerBody, UpdateOrderTakerParams } from "../../shared/index.ts";

export const updateOrderTakerConnection = async ({
  restaurantId,
  orderTakerId,
  fromTime,
  toTime,
  isActive,
  name,
  email,
}: UpdateOrderTakerParams & { name?: string; email?: string; isActive?: boolean }) => {

  // 1️⃣ Validate the order taker exists in the restaurant
  const orderTaker = await prisma.users.findFirst({
    where: {
      id: orderTakerId,
      restaurantId,
      userRoles: { some: { role: "Order_Taker" } },
    },
    include: {
      waiterConnection: true,
    },
  });

  if (!orderTaker) throw new Error("Unauthorized - Order Taker not in your restaurant");

  const updatedUser = await prisma.users.update({
    where: { id: orderTakerId },
    data: {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
    },
     select: {
    id: true,
    restaurantId: true,
    name: true,
    email: true,
    isEmailVerified: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  },
  });

  const updatedConnections = await prisma.waiterConnection.updateMany({
    where: { orderTakerId },
    data: {
      ...(fromTime !== undefined && { fromTime }),
      ...(toTime !== undefined && { toTime }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return {
    user: updatedUser,
    connectionsUpdated: updatedConnections.count,
  };
};
