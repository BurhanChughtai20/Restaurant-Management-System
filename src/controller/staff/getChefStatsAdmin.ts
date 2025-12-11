import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../libs/prisma.ts";

export async function getChefStats(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const totalChefs = await prisma.userRole.count({
      where: { role: "Chef", isActive: true },
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const activeDaily = await prisma.chefConnection.count({
      where: {
        isActive: true,
        updatedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const inactiveDaily = await prisma.chefConnection.count({
      where: {
        isActive: false,
        updatedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return reply.send({
      message: "Chef statistics fetched successfully",
      data: {
        totalChefs,
        activeChefsDaily: activeDaily,
        inactiveChefsDaily: inactiveDaily,
      },
    });
  } catch (error: any) {
    console.error("getChefStats error:", error);
    return reply.status(400).send({ error: error.message });
  }
}
