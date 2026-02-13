import prisma from "../../libs/prisma.ts";

export const deleteOrderTakerConnection = async ({
  restaurantId,
  connectionId,
}: { restaurantId: number; connectionId: number }) => {
  const connection = await prisma.waiterConnection.findFirst({
    where: {
      id: connectionId,
      waiter: { restaurantId },
    },
    select: {
      id: true,
      orderTakerId: true,
    },
  });

  if (!connection) throw new Error("Connection not found or unauthorized");

  const { orderTakerId } = connection;

  await prisma.waiterConnection.delete({
    where: { id: connectionId },
  });

  const remainingConnections = await prisma.waiterConnection.count({
    where: { orderTakerId },
  });

  if (remainingConnections === 0 && orderTakerId !== null) {
    await prisma.users.update({
      where: { id: orderTakerId },
      data: { isActive: false },
    });
  }

  return {
    message: "Order Taker connection deleted successfully",
    userDeactivated: remainingConnections === 0,
  };
};
