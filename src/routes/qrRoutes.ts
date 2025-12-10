import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { generateQRToken } from "../controller/qr/generateQRToken.ts";
import { deleteOrderTakerConnection } from "../sockets/deleteOrderTakerConnection.ts";
import { updateOrderTakerConnection } from "../sockets/updateOrderTakerConnection.ts";
import { getOrderTakerStats } from "../controller/qr/getOrderTakerStats.ts";

interface UpdateOrderTakerBody {
  orderTakerId: number;
  fromTime: string;
  toTime: string;
}

interface DeleteOrderTakerBody {
  orderTakerId: number;
}

async function waitersManagementRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/token-order-taker",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        return await generateQRToken(request, reply);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.delete<{ Body: DeleteOrderTakerBody }>(
    "/token-order-taker",
    async (request, reply) => {
      try {
        return await deleteOrderTakerConnection(request, reply);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.patch<{ Body: UpdateOrderTakerBody }>(
    "/token-order-taker",
    async (request, reply) => {
      try {
        const { orderTakerId, fromTime, toTime } = request.body;
        const updated = await updateOrderTakerConnection({
          orderTakerId,
          fromTime,
          toTime,
        });
        return reply.send({
          message: "Order Taker timing updated successfully",
          data: updated,
        });
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.get(
    "/order-taker/stats",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return await getOrderTakerStats(request, reply);
    }
  );
}

export default waitersManagementRoutes;
