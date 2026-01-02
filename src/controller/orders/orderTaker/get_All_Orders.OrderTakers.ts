import prisma from "../../../libs/prisma.ts";

export async function get_All_Orders_OrderTakers(
  restaurantId: number,
  orderTakerId: number
) {
  try {
    // 🔥 Verify order taker belongs to restaurant
    const orderTaker = await prisma.users.findFirst({
      where: {
        id: orderTakerId,
        restaurantId,
        userRoles: { some: { role: "Order_Taker" } },
      },
    });

    if (!orderTaker) {
      throw new Error("Unauthorized - Order Taker not in your restaurant");
    }

    const orders = await prisma.order.findMany({
      where: {
        restaurantId, // 🔥 Ensure restaurant isolation
        orderTakerId,
      },
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
