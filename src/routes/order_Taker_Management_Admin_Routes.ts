import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { generateQRToken } from "../utils/generateQRToken.ts"; 
import { deleteOrderTakerConnection } from "../controller/sockets/deleteOrderTakerConnection.ts";
import { updateOrderTakerConnection } from "../controller/sockets/updateOrderTakerConnection.ts";
import { getOrderTakerStats } from "../controller/staff/waiter/getOrderTakerStatsAdmin.ts";
import { getAllOrderTakers } from "../controller/staff/waiter/getAllOrderTakers.ts";
import { searchWaiters } from "../controller/staff/waiter/searchWaiters.ts";
import { paginateWaiters } from "../controller/staff/waiter/paginateWaiters.ts";

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
    "/",
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const orderTakers = await getAllOrderTakers();
        return reply.send(orderTakers);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

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
        const updated = await updateOrderTakerConnection({ orderTakerId,
          ...(fromTime !== undefined && { fromTime }),
          ...(toTime !== undefined && { toTime }),
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

fastify.get(
  "/waiters/search",
  { preHandler: [fastify.authenticate] },
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { page = 1, limit = 10, search, isActive } = request.query as any;

      const result = await searchWaiters({
        search,
        page: Number(page),
        limit: Number(limit),
        isActive: isActive !== undefined ? isActive === "true" : undefined,
      });

      return reply.send(result);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
);

fastify.get(
  "/waiters/paginate",
  { preHandler: [fastify.authenticate] },
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { page = 1, limit = 10 } = request.query as any;

      const result = await paginateWaiters({
        page: Number(page),
        limit: Number(limit),
      });

      return reply.send(result);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
);

}

export default waitersManagementRoutes;
