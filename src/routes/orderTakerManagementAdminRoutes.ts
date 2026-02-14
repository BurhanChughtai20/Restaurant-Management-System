import type { FastifyInstance } from "fastify";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";

import {
  deleteOrderTakerConnection,
  updateOrderTakerConnection,
  getOrderTakerStats,
  searchWaiters,
  getOrderTakers,
  connectWaiter,
} from "../controller/index.ts";

import type {
  DeleteOrderTakerBody,
  UpdateOrderTakerBody,
} from "../shared/index.ts";
import { generateQRTokenWaiter } from "../utils/generateQRTokenWaiter.ts";

async function orderTakerManagementRoutes(fastify: FastifyInstance) {
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
    handler: (body: T, restaurantId: number) => Promise<any>,
  ) {
    fastify.patch<{ Body: T }>(
      path,
      { preHandler: [restaurantAuth] },
      async (req, reply) => {
        const restaurantId = (req as any).restaurantId;
        const result = await handler(req.body as T, restaurantId);
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

  function registerPost<T>(
    path: string,
    handler: (body: T, restaurantId: number) => Promise<any>,
    rolesRequired: boolean = true,
  ) {
    fastify.post<{ Body: T }>(
      path,
      rolesRequired ? { preHandler: [restaurantAuth] } : {},
      async (req, reply) => {
        const restaurantId = (req as any).restaurantId;
        const result = await handler(req.body as T, restaurantId);
        return reply.send(result);
      },
    );
  }

  registerPost<{ sessionToken: string; orderTakerId: number }>(
    "/connect-waiter",
    async (body) => connectWaiter(body),
    false,
  );

  registerGet("/", (restaurantId, query) =>
    getOrderTakers({
      restaurantId,
      limit: Number(query?.limit) || 10,
      ...(query?.cursorId && { cursorId: Number(query.cursorId) }),
    }),
  );

  registerGet("/token", async (_restaurantId, _query, req, reply) =>
    generateQRTokenWaiter(req, reply),
  );

  registerDelete<DeleteOrderTakerBody>("/token", (body, restaurantId) =>
    deleteOrderTakerConnection({ ...body, restaurantId }),
  );

  registerPatch<UpdateOrderTakerBody>("/token", (body, restaurantId) =>
    updateOrderTakerConnection({
      restaurantId,
      orderTakerId: body.orderTakerId,
      ...(body.fromTime !== undefined && { fromTime: body.fromTime }),
      ...(body.toTime !== undefined && { toTime: body.toTime }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      ...(body.name !== undefined && { name: body.name }),
      ...(body.email !== undefined && { email: body.email }),
    }),
  );

  registerGet("/order-taker/stats", (_restaurantId, _query, req, reply) =>
    getOrderTakerStats(req, reply),
  );

  registerGet("/search", (restaurantId, query) =>
    searchWaiters({
      restaurantId,
      search: query?.search || "",
      page: Number(query?.page) || 1,
      limit: Number(query?.limit) || 10,
      ...(query?.isActive !== undefined && {
        isActive: query.isActive === "true",
      }),
    }),
  );
}

export default orderTakerManagementRoutes;
