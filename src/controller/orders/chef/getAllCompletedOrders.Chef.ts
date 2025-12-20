import prisma from "../../../libs/prisma.ts";

export async function getAllCompletedOrdersForChef(chefId: number) {
  try {
    const orders = await prisma.order.findMany({
      where: { chefId, status: "COMPLETED" },
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
