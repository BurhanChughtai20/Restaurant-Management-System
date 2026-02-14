import prisma from "../../libs/prisma.ts";
import type { UpdateChefConnectionParams } from "../../shared/interfaces/chef.interface.ts";

export const updateChefConnection = async ({
  restaurantId,
  chefId,
  fromTime,
  toTime,
  isActive,
  name,
  email,
}: UpdateChefConnectionParams & { name?: string; email?: string; isActive?: boolean }) => {
  const chef = await prisma.users.findFirst({
    where: {
      id: chefId,
      restaurantId,
      userRoles: { some: { role: "Chef" } },
    },
    include: {
      chefConnection: true,
    },
  });

  if (!chef) throw new Error("Unauthorized - Chef not in your restaurant");

  const updatedUser = await prisma.users.update({
    where: { id: chefId },
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

  const updatedConnections = await prisma.chefConnection.updateMany({
    where: { chefId },
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
