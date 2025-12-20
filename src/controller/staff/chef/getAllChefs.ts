import prisma from "../../../libs/prisma.ts";

export async function getAllChefs() {
  return prisma.users.findMany({
    where: { userRoles: { some: { role: "Chef" } } },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      isEmailVerified: true,
      chefConnection: {
        select: {
          isActive: true,
          fromTime: true,
          toTime: true,
        },
      },
    },
  });
}
