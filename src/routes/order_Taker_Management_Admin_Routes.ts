import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { generateQRToken } from "../utils/generateQRToken.ts"; 
import { deleteOrderTakerConnection } from "../controller/sockets/deleteOrderTakerConnection.ts";
import { updateOrderTakerConnection } from "../controller/sockets/updateOrderTakerConnection.ts";
import { getOrderTakerStats } from "../controller/staff/waiter/getOrderTakerStatsAdmin.ts";

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
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const tokenData = await generateQRToken(request, reply);
        return reply.send(tokenData);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.delete<{ Body: DeleteOrderTakerBody }>(
    "/token-order-taker",
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest<{ Body: DeleteOrderTakerBody }>, reply: FastifyReply) => {
      try {
        const result = await deleteOrderTakerConnection(request, reply);
        return reply.send(result);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.patch<{ Body: UpdateOrderTakerBody }>(
    "/token-order-taker",
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest<{ Body: UpdateOrderTakerBody }>, reply: FastifyReply) => {
      try {
        const { orderTakerId, fromTime, toTime } = request.body;
        const updated = await updateOrderTakerConnection({ orderTakerId, fromTime, toTime });

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
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const stats = await getOrderTakerStats(request, reply);
        return reply.send(stats);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );
}

export default waitersManagementRoutes;
