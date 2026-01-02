import prisma from "../../../libs/prisma.ts";

export async function getAllOrderTakers(restaurantId: number) {
  try {
    const orderTakers = await prisma.users.findMany({
      where: {
        restaurantId,
        userRoles: { some: { role: "Order_Taker", isActive: true } },
      },
      select: {
        id: true,
        name: true,
        email: true,
        restaurantId: true,
        createdAt: true,
        isEmailVerified: true,
        waiterConnection: {
          select: {
            id: true,
            orderTakerId: true,
            isActive: true,
            fromTime: true,
            toTime: true,
            createdAt: true,
          },
        },
      },
    });
    return orderTakers;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch order takers");
  }
}
