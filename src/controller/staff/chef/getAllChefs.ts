import prisma from "../../../libs/prisma.ts";

export async function getAllChefs(restaurantId: number) {
  const chefs = await prisma.users.findMany({
    where: {
      restaurantId,
      userRoles: {
        some: { role: "Chef", isActive: true },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      restaurantId: true,
      createdAt: true,
      isEmailVerified: true,
      chefConnection: {
        select: {
          id: true,
          chefId: true,
          isActive: true,
          fromTime: true,
          toTime: true,
          createdAt: true,
        },
      },
    },
  });

  return chefs;
}
