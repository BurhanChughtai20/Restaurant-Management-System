import prisma from "../../libs/prisma.ts";

export const deleteChefConnection = async ({
  restaurantId,
  connectionId,
}: { restaurantId: number; connectionId: number }) => {
  const connection = await prisma.chefConnection.findFirst({
    where: {
      id: connectionId,
      chef: { restaurantId },
    },
    select: {
      id: true,
      chefId: true,
    },
  });

  if (!connection) throw new Error("Connection not found or unauthorized");

  const { chefId } = connection;

  await prisma.chefConnection.delete({
    where: { id: connectionId },
  });

  const remainingConnections = await prisma.chefConnection.count({
    where: { chefId },
  });

  if (remainingConnections === 0 && chefId !== null) {
    await prisma.users.update({
      where: { id: chefId },
      data: { isActive: false },
    });
  }

  return {
    message: "Chef connection deleted successfully",
    userDeactivated: remainingConnections === 0,
  };
};
