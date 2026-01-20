import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { generateQRToken } from "../utils/generateQRToken.ts";
import { deleteOrderTakerConnection } from "../controller/sockets/deleteOrderTakerConnection.ts";
import { updateOrderTakerConnection } from "../controller/sockets/updateOrderTakerConnection.ts";
import { getAllOrderTakers } from "../controller/staff/order_taker/getAllOrderTakers.ts";
import { getOrderTakerStats } from "../controller/staff/order_taker/getOrderTakerStatsAdmin.ts";
import { searchWaiters } from "../controller/staff/order_taker/searchWaiters.ts";
import { paginateWaiters } from "../controller/staff/order_taker/paginateWaiters.ts";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";

interface UpdateOrderTakerBody {
  orderTakerId: number;
  fromTime: string;
  toTime: string;
}

interface DeleteOrderTakerBody {
  orderTakerId: number;
}

async function waitersManagementRoutes(fastify: FastifyInstance) {
  // Get all order takers
  fastify.get(
    "/",
    { preHandler: [restaurantAuth] },
    async (request: FastifyRequest) => {
      const restaurantId = (request as any).restaurantId;
      return getAllOrderTakers(restaurantId);
    }
  );

  // Generate QR Token
  fastify.get(
    "/token-order-taker",
    { preHandler: [restaurantAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const tokenData = await generateQRToken(request, reply);
      return reply.send(tokenData);
    }
  );

  // Delete Order Taker Connection
  fastify.delete<{ Body: DeleteOrderTakerBody }>(
    "/token-order-taker",
    { preHandler: [restaurantAuth] },
    async (request, reply) => {
      const result = await deleteOrderTakerConnection(request, reply);
      return reply.send(result);
    }
  );

  // Update Order Taker Timing
  fastify.patch<{ Body: UpdateOrderTakerBody }>(
    "/token-order-taker",
    { preHandler: [restaurantAuth] },
    async (request, reply) => {
      const restaurantId = (request as any).restaurantId;
      const { orderTakerId, fromTime, toTime } = request.body;

      const updated = await updateOrderTakerConnection({
        restaurantId,
        orderTakerId,
        ...(fromTime !== undefined && { fromTime }),
        ...(toTime !== undefined && { toTime }),
      });

      return reply.send({
        message: "Order Taker timing updated successfully",
        data: updated,
      });
    }
  );

  // Get Stats
  fastify.get(
    "/order-taker/stats",
    { preHandler: [restaurantAuth] },
    async (request, reply) => {
      const stats = await getOrderTakerStats(request, reply);
      return reply.send(stats);
    }
  );

  // Search Waiters
  fastify.get(
    "/waiters/search",
    { preHandler: [restaurantAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const { page = 1, limit = 10, search, isActive } = request.query as any;

      const result = await searchWaiters({
        restaurantId,
        search,
        page: Number(page),
        limit: Number(limit),
        isActive: isActive !== undefined ? isActive === "true" : undefined,
      });

      return reply.send(result);
    }
  );

  // Paginate Waiters
  fastify.get(
    "/waiters/paginate",
    { preHandler: [restaurantAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const { page = 1, limit = 10 } = request.query as any;

      const result = await paginateWaiters({
        restaurantId,
        page: Number(page),
        limit: Number(limit),
      });

      return reply.send(result);
    }
  );
}

export default waitersManagementRoutes;