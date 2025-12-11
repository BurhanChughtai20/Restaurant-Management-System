import prisma from "../../../libs/prisma.ts";

export async function getAllChefs() {
  try {
    const chefs = await prisma.users.findMany({
      where: { userRoles: { some: { role: "Chef" } } },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        isEmailVerified: true,
        chefConnections: {
          select: {
            isActive: true,
            fromTime: true,
            toTime: true
          }
        }
      }
    });
    return chefs;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch chefs");
  }
}
