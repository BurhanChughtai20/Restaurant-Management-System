import prisma from "../../../libs/prisma.ts";

export async function get_All_Orders_OrderTakers(orderTakerId: number) {
  try {
    const orders = await prisma.order.findMany({
      where: { orderTakerId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return orders;
  } catch (error) {
    throw new Error("Failed to fetch orders");
  }
}
