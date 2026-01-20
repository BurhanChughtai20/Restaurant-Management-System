import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { generateQRToken } from "../utils/generateQRToken.ts";
import { getChefStats } from "../controller/staff/chef/getChefStatsAdmin.ts";
import { deleteChefConnection } from "../controller/sockets/deleteChefConnection.ts";
import { updateChefConnection } from "../controller/sockets/updateChefConnection.ts";
import { getAllChefs } from "../controller/staff/chef/getAllChefs.ts";
import { searchChefs } from "../controller/staff/chef/searchChefs.ts";
import { paginateChefs } from "../controller/staff/chef/paginateChefs.ts";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";

interface UpdateChefBody {
  chefId: number;
  fromTime?: string;
  toTime?: string;
}

interface DeleteChefBody {
  chefId: number;
}

async function chefsManagementRoutes(fastify: FastifyInstance) {
  
  // Get all chefs
  fastify.get(
    "/",
    { preHandler: [restaurantAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const chefs = await getAllChefs(restaurantId);
      return reply.send(chefs);
    }
  );

  // Generate QR Token for Chef
  fastify.get(
    "/token-chef",
    { preHandler: [restaurantAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const tokenData = await generateQRToken(request, reply);
      return reply.send(tokenData);
    }
  );

  // Delete Chef Connection
  fastify.delete<{ Body: DeleteChefBody }>(
    "/token-chef",
    { preHandler: [restaurantAuth] },
    async (request, reply) => {
      const result = await deleteChefConnection(request, reply);
      return reply.send(result);
    }
  );

  // Update Chef Timing
  fastify.patch<{ Body: UpdateChefBody }>(
    "/token-chef",
    { preHandler: [restaurantAuth] },
    async (request, reply) => {
      const restaurantId = (request as any).restaurantId;
      const { chefId, fromTime, toTime } = request.body;
      
      const updated = await updateChefConnection({
        restaurantId,
        chefId,
        ...(fromTime !== undefined && { fromTime }),
        ...(toTime !== undefined && { toTime }),
      });

      return reply.send({
        message: "Chef timing updated successfully",
        data: updated,
      });
    }
  );

  // Get Chef Stats
  fastify.get(
    "/chef/stats",
    { preHandler: [restaurantAuth] },
    async (request, reply) => {
      const stats = await getChefStats(request, reply);
      return reply.send(stats);
    }
  );

  // Search Chefs with Pagination & Filters
  fastify.get(
    "/search",
    { preHandler: [restaurantAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const query = request.query as any;

      const result = await searchChefs({
        restaurantId,
        search: query.search || "",
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        ...(query.isActive !== undefined && { isActive: query.isActive === "true" }),
      });

      return reply.send(result);
    }
  );

  // Paginate Chefs
  fastify.get(
    "/paginate",
    { preHandler: [restaurantAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const query = request.query as any;

      const result = await paginateChefs({
        restaurantId,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
      });

      return reply.send(result);
    }
  );
}

export default chefsManagementRoutes;