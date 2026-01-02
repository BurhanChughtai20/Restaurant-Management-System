import prisma from "../../../libs/prisma.ts";

export async function getAllCompletedOrdersForChef(
  restaurantId: number,
  chefId: number
) {
  try {
    // 🔥 Verify chef belongs to restaurant
    const chef = await prisma.users.findFirst({
      where: {
        id: chefId,
        restaurantId,
        userRoles: { some: { role: "Chef" } },
      },
    });

    if (!chef) {
      throw new Error("Unauthorized - Chef not in your restaurant");
    }

    const orders = await prisma.order.findMany({
      where: {
        restaurantId, // 🔥 Ensure restaurant isolation
        chefId,
        status: "COMPLETED",
      },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  } catch (error) {
    throw new Error("Failed to fetch completed orders for chef");
  }
}
