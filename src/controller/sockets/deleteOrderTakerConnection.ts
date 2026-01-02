import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../libs/prisma.ts";

export interface DeleteOrderTakerBody {
  orderTakerId: number;
}

export const deleteOrderTakerConnection = async (
  req: FastifyRequest<{ Body: DeleteOrderTakerBody }>,
  reply: FastifyReply
) => {
  const { orderTakerId } = req.body;
  const restaurantId = (req as any).restaurantId;

  try {
    // 🔥 Verify order taker belongs to the restaurant
    const orderTaker = await prisma.users.findFirst({
      where: {
        id: orderTakerId,
        restaurantId,
        userRoles: {
          some: { role: "Order_Taker" },
        },
      },
    });

    if (!orderTaker) {
      return reply
        .status(403)
        .send({ message: "Unauthorized - Order Taker not in your restaurant" });
    }

    const connection = await prisma.waiterConnection.findUnique({
      where: { orderTakerId },
    });

    if (!connection) {
      return reply
        .status(404)
        .send({ message: "Order Taker connection not found" });
    }

    await prisma.waiterConnection.delete({
      where: { orderTakerId },
    });

    return reply.send({
      message: "Order Taker connection deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: "Server error" });
  }
};
