import type { FastifyInstance } from "fastify";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";
import { generateQRToken } from "../utils/generateQRToken.ts";
import {
  getOrderTakers,
  deleteOrderTakerConnection,
  updateOrderTakerConnection,
  getOrderTakerStats,
  searchWaiters,
} from "../controller/index.ts";
import { DeleteOrderTakerBody, UpdateOrderTakerBody } from "../shared/index.ts";

async function waitersManagementRoutes(fastify: FastifyInstance) {
  function registerGet(
    path: string,
    handler: (
      restaurantId: number,
      query?: any,
      req?: any,
      reply?: any,
    ) => Promise<any>,
  ) {
    fastify.get(path, { preHandler: [restaurantAuth] }, async (req, reply) => {
      const restaurantId = (req as any).restaurantId;
      const result = await handler(restaurantId, req.query, req, reply);
      return reply.send(result);
    });
  }

  function registerPatch<T>(
    path: string,
    handler: (body: T, restaurantId: number, params?: any) => Promise<any>,
  ) {
    fastify.patch<{ Body: T; Params: any }>(
      path,
      { preHandler: [restaurantAuth] },
      async (req, reply) => {
        const restaurantId = (req as any).restaurantId;
        const result = await handler(req.body as T, restaurantId, req.params);
        return reply.send(result);
      },
    );
  }

  function registerDelete<T>(
    path: string,
    handler: (body: T, restaurantId: number) => Promise<any>,
  ) {
    fastify.delete<{ Body: T }>(
      path,
      { preHandler: [restaurantAuth] },
      async (req, reply) => {
        const restaurantId = (req as any).restaurantId;
        const result = await handler(req.body as T, restaurantId);
        return reply.send(result);
      },
    );
  }

  registerGet("/waiters", (restaurantId, query) =>
    getOrderTakers({
      restaurantId,
      limit: Number(query?.limit) || 10,
      ...(query.cursorId ? { cursorId: Number(query?.cursorId) } : {}),
    }),
  );

  // QR token routes
  registerGet("/token-order-taker", async (_restaurantId, _query, req, reply) =>
    generateQRToken(req, reply),
  );

  registerDelete<DeleteOrderTakerBody>(
    "/token-order-taker",
    (body, restaurantId) =>
      deleteOrderTakerConnection({ ...body, restaurantId }),
  );

  registerPatch<UpdateOrderTakerBody>(
    "/token-order-taker",
    async (body, restaurantId) =>
      updateOrderTakerConnection({
        restaurantId,
        orderTakerId: body.orderTakerId,
        ...(body.fromTime !== undefined && { fromTime: body.fromTime }),
        ...(body.toTime !== undefined && { toTime: body.toTime }),
      }),
  );

  registerGet("/order-taker/stats", (restaurantId, _query, req, reply) =>
    getOrderTakerStats(req, reply),
  );

  registerGet("/waiters/search", (restaurantId, query) =>
    searchWaiters({
      restaurantId,
      search: query?.search,
      page: Number(query?.page) || 1,
      limit: Number(query?.limit) || 10,
      ...(query?.isActive !== undefined && {
        isActive: query.isActive === "true",
      }),
    }),
  );
}

export default waitersManagementRoutes;
