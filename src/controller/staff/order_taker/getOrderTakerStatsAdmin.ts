import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../../libs/prisma.ts";

export async function getOrderTakerStats(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const restaurantId = (request as any).restaurantId;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 🔥 Filter by restaurantId for all stats
    const totalOrderTakers = await prisma.userRole.count({
      where: {
        role: "Order_Taker",
        isActive: true,
        user: { restaurantId }, // Ensure restaurant isolation
      },
    });

    const activeDaily = await prisma.waiterConnection.count({
      where: {
        isActive: true,
        updatedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        waiter: { restaurantId }, // Ensure restaurant isolation
      },
    });
    const inactiveDaily = await prisma.waiterConnection.count({
      where: {
        isActive: false,
        updatedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        waiter: { restaurantId }, // Ensure restaurant isolation
      },
    });

    return reply.send({
      message: "Order Taker statistics fetched successfully",
      data: {
        totalOrderTakers,
        activeOrderTakersDaily: activeDaily,
        inactiveOrderTakersDaily: inactiveDaily,
      },
    });
  } catch (error: any) {
    return reply.status(400).send({ error: error.message });
  }
}
