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
  const chef = await prisma.users.findFirst({
    where: {
      id: chefId,
      restaurantId,
      userRoles: { some: { role: "Chef" } },
    },
    select: { id: true },
  });

  if (!chef) throw new Error("Unauthorized - Chef not in your restaurant");

  return prisma.chefConnection.update({
    where: { chefId },
    data: { ...(fromTime && { fromTime }), ...(toTime && { toTime }) },
  });
};
