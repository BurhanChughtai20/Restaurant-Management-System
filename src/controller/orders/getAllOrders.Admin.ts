import prisma from "../../libs/prisma.ts";
import { AdminOrder, GetAllOrdersParams } from "../../shared/index.ts";
export async function getAllOrders({
  restaurantId,
  limit = 20,
  cursorId,
}: GetAllOrdersParams): Promise<AdminOrder[]> {
  try {
    const orders = await prisma.order.findMany({
      where: { restaurantId },
      take: limit,
      ...(cursorId !== undefined ? { cursor: { id: cursorId }, skip: 1 } : {}),
      orderBy: { id: "desc" },
      select: {
        id: true,
        restaurantId: true,
        orderTakerId: true,
        chefId: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            orderId: true,
            name: true,
            description: true,
            quantity: true,
            price: true,
            total: true,
            menuItemId: true,
          },
        },
      },
    }); 
    return orders; 
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}