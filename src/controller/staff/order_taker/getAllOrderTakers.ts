import prisma from "../../../libs/prisma.ts";
import { GetOrderTakersParams, PaginatedOrderTakers } from "../../../shared/index.ts"; 

export async function getOrderTakers({
  restaurantId,
  limit = 10,
  cursorId,
}: GetOrderTakersParams): Promise<PaginatedOrderTakers> {  
  try {
    const orderTakers = await prisma.users.findMany({
      where: {
        restaurantId,
        userRoles: { some: { role: "Order_Taker", isActive: true } },
      },
      take: limit,
      ...(cursorId !== undefined
        ? { cursor: { id: cursorId }, skip: 1 }
        : {}),
      orderBy: { id: "asc" },
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

    const nextCursor = orderTakers[orderTakers.length - 1]?.id ?? null;

    return {
      data: orderTakers,
      nextCursor,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch order takers");
  }
}
