import type { FastifyInstance } from "fastify";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";

import type {
  DeleteChefBody,
  UpdateChefBody,
} from "../shared/interfaces/chef.interface.ts";
import {
  deleteChefConnection,
  getAllChefs,
  searchChefs,
  updateChefConnection,
} from "../controller/index.ts";
import { getChefStats } from "../controller/staff/chef/getChefStatsAdmin.ts";
import { connectChef } from "../controller/orders/chef/connectChef.ts";
import { generateQRTokenChef } from "../utils/generateQRTokenChef.ts";

async function chefsManagementRoutes(fastify: FastifyInstance) {
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

  registerPost<{ sessionToken: string; chefId: number }>(
    "/connect-chef",
    async (body) => connectChef(body),
    false,
  );

  registerGet("/", (restaurantId, query) =>
    getAllChefs({
      restaurantId,
      limit: Number(query?.limit) || 10,
      ...(query.cursorId ? { cursorId: Number(query?.cursorId) } : {}),
    }),
  );

  registerGet("/token", async (_restaurantId, _query, req, reply) =>
    generateQRTokenChef(req, reply),
  );

  registerDelete<DeleteChefBody>("/token", (body, restaurantId) =>
    deleteChefConnection({ ...body, restaurantId }),
  );

  // Update chef timing
  registerPatch<UpdateChefBody>("/token", (body, restaurantId) =>
    updateChefConnection({
      restaurantId,
      chefId: body.chefId,
      ...(body.fromTime !== undefined && { fromTime: body.fromTime }),
      ...(body.toTime !== undefined && { toTime: body.toTime }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      ...(body.name !== undefined && { name: body.name }),
      ...(body.email !== undefined && { email: body.email }),
    }),
  );

  // Chef stats
  registerGet("/stats", (_restaurantId, _query, req, reply) =>
    getChefStats(req, reply),
  );

  registerGet("/search", (restaurantId, query) =>
    searchChefs({
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

export default chefsManagementRoutes;
