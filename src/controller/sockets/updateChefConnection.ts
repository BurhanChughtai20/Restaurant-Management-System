import prisma from "../../libs/prisma.ts";

interface UpdateChefConnectionParams {
  restaurantId: number;
  chefId: number;
  fromTime?: string;
  toTime?: string;
}

export const updateChefConnection = async ({
  restaurantId,
  chefId,
  fromTime,
  toTime,
}: UpdateChefConnectionParams) => {
  // 🔥 Verify chef belongs to the restaurant
  const chef = await prisma.users.findFirst({
    where: {
      id: chefId,
      restaurantId,
      userRoles: {
        some: { role: "Chef" },
      },
    },
  });

  if (!chef) {
    throw new Error("Unauthorized - Chef not in your restaurant");
  }

  const connection = await prisma.chefConnection.findUnique({
    where: { chefId },
  });

  if (!connection) {
    throw new Error("Chef connection not found");
  }

  const updatedConnection = await prisma.chefConnection.update({
    where: { chefId },
    data: {
      fromTime: fromTime ?? connection.fromTime,
      toTime: toTime ?? connection.toTime,
    },
  });

  return updatedConnection;
};
