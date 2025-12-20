import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { generateQRToken } from "../utils/generateQRToken.ts";
import { deleteOrderTakerConnection } from "../controller/sockets/deleteOrderTakerConnection.ts";
import { updateOrderTakerConnection } from "../controller/sockets/updateOrderTakerConnection.ts"; 
import { asyncHandler } from "../utils/asyncHandler.ts";
import { getAllOrderTakers } from "../controller/staff/order_taker/getAllOrderTakers.ts";
import { getOrderTakerStats } from "../controller/staff/order_taker/getOrderTakerStatsAdmin.ts";
import { searchWaiters } from "../controller/staff/order_taker/searchWaiters.ts";
import { paginateWaiters } from "../controller/staff/order_taker/paginateWaiters.ts";

interface UpdateOrderTakerBody { orderTakerId: number; fromTime: string; toTime: string; }
interface DeleteOrderTakerBody { orderTakerId: number; }

async function waitersManagementRoutes(fastify: FastifyInstance) {

  fastify.get(
    "/",
    { preHandler: [fastify.authenticate] },
    asyncHandler(async (_, reply: FastifyReply) => {
      const orderTakers = await getAllOrderTakers();
      return reply.send(orderTakers);
    })
  );

  fastify.get(
    "/token-order-taker",
    { preHandler: [fastify.authenticate] },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const tokenData = await generateQRToken(request, reply);
      return reply.send(tokenData);
    })
  );

  fastify.delete<{ Body: DeleteOrderTakerBody }>(
    "/token-order-taker",
    { preHandler: [fastify.authenticate] },
    asyncHandler(async (request, reply) => {
      const result = await deleteOrderTakerConnection(request, reply);
      return reply.send(result);
    })
  );

  fastify.patch<{ Body: UpdateOrderTakerBody }>(
    "/token-order-taker",
    { preHandler: [fastify.authenticate] },
    asyncHandler(async (request, reply) => {
      const { orderTakerId, fromTime, toTime } = request.body;

      const updated = await updateOrderTakerConnection({
        orderTakerId,
        ...(fromTime !== undefined && { fromTime }),
        ...(toTime !== undefined && { toTime }),
      });

      return reply.send({
        message: "Order Taker timing updated successfully",
        data: updated,
      });
    })
  );

  fastify.get(
    "/order-taker/stats",
    { preHandler: [fastify.authenticate] },
    asyncHandler(async (request, reply) => {
      const stats = await getOrderTakerStats(request, reply);
      return reply.send(stats);
    })
  );

  fastify.get(
    "/waiters/search",
    { preHandler: [fastify.authenticate] },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const { page = 1, limit = 10, search, isActive } = request.query as any;

      const result = await searchWaiters({
        search,
        page: Number(page),
        limit: Number(limit),
        isActive: isActive !== undefined ? isActive === "true" : undefined,
      });

      return reply.send(result);
    })
  );

  fastify.get(
    "/waiters/paginate",
    { preHandler: [fastify.authenticate] },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const { page = 1, limit = 10 } = request.query as any;

      const result = await paginateWaiters({
        page: Number(page),
        limit: Number(limit),
      });

      return reply.send(result);
    })
  );
}

export default waitersManagementRoutes;