import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../libs/prisma.ts";

export interface DeleteOrderTakerBody {
  orderTakerId: number;
}

export const deleteOrderTakerConnection = async (
  req: FastifyRequest<{ Body: DeleteOrderTakerBody }>,
  reply: FastifyReply
) => {
  const { orderTakerId } = req.body;

  try {
    const connection = await prisma.waiterConnection.findUnique({
      where: { Order_Taker_ID: orderTakerId },
    });

    if (!connection) {
      return reply.status(404).send({ message: "Order Taker connection not found" });
    }

    await prisma.waiterConnection.delete({
      where: { Order_Taker_ID: orderTakerId },
    });

    return reply.send({ message: "Order Taker connection deleted successfully" });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: "Server error" });
  }
};
