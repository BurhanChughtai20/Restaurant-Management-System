import type { FastifyInstance } from "fastify";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";
import { generateQRToken } from "../utils/generateQRToken.ts";

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

  registerGet("/chefs", (restaurantId, query) => 
   getAllChefs({
        restaurantId, 
        limit: Number(query?.limit) || 10,
        ...(query.cursorId ? { cursorId: Number(query?.cursorId) } : {}),
      }));
      
  registerGet("/token-chef", async (_restaurantId, _query, req, reply) =>
    generateQRToken(req, reply),
  );

  registerDelete<DeleteChefBody>("/token-chef", (body, restaurantId) =>
    deleteChefConnection({ ...body, restaurantId }),
  );

  // Update chef timing
  registerPatch<UpdateChefBody>("/token-chef", (body, restaurantId) =>
    updateChefConnection({
      restaurantId,
      chefId: body.chefId,
      ...(body.fromTime !== undefined && { fromTime: body.fromTime }),
      ...(body.toTime !== undefined && { toTime: body.toTime }),
    }),
  );

  // Chef stats
  registerGet("/chef/stats", (_restaurantId, _query, req, reply) =>
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
