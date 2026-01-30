import prisma from "../../libs/prisma.ts";

export const deleteChefConnection = async ({
  restaurantId,
  chefId,
}: { restaurantId: number; chefId: number }) => {
  const chef = await prisma.users.findFirst({
    where: {
      id: chefId,
      restaurantId,
      userRoles: { some: { role: "Chef" } },
    },
    select: { id: true },
  });

  if (!chef) throw new Error("Unauthorized - Chef not in your restaurant");

  try {
    await prisma.chefConnection.delete({ where: { chefId } });
  } catch {
    throw new Error("Chef connection not found");
  }

  return { message: "Chef connection deleted successfully" };
};
