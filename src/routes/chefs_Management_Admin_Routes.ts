import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { generateQRToken } from "../utils/generateQRToken.ts";
import { getChefStats } from "../controller/staff/chef/getChefStatsAdmin.ts";
import { deleteChefConnection } from "../controller/sockets/deleteChefConnection.ts";
import { updateChefConnection } from "../controller/sockets/updateChefConnection.ts";
import { getAllChefs } from "../controller/staff/chef/getAllChefs.ts";
import { searchChefs } from "../controller/staff/chef/searchChefs.ts";
import { paginateChefs } from "../controller/staff/chef/paginateChefs.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
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
  fastify.get(
    "/",
    { preHandler: [restaurantAuth] },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const chefs = await getAllChefs(restaurantId);
      return reply.send(chefs);
    })
  );

  fastify.get(
    "/token-chef",
    { preHandler: [restaurantAuth] },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const tokenData = await generateQRToken(request, reply);
      return reply.send(tokenData);
    })
  );

  fastify.delete<{ Body: DeleteChefBody }>(
    "/token-chef",
    { preHandler: [restaurantAuth] },
    asyncHandler(async (request, reply) => {
      const result = await deleteChefConnection(request, reply);
      return reply.send(result);
    })
  );

  fastify.patch<{ Body: UpdateChefBody }>(
    "/token-chef",
    { preHandler: [restaurantAuth] },
    asyncHandler(async (request, reply) => {
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
    })
  );

  fastify.get(
    "/chef/stats",
    { preHandler: [restaurantAuth] },
    asyncHandler(async (request, reply) => {
      const stats = await getChefStats(request, reply);
      return reply.send(stats);
    })
  );

  fastify.get(
    "/search",
    { preHandler: [restaurantAuth] },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const {
        search = "",
        page = "1",
        limit = "10",
        isActive,
      } = request.query as {
        search?: string;
        page?: string;
        limit?: string;
        isActive?: string;
      };

      const result = await searchChefs({
        restaurantId,
        search,
        page: Number(page),
        limit: Number(limit),
        ...(isActive !== undefined && { isActive: isActive === "true" }),
      });

      return reply.send(result);
    })
  );

  fastify.get(
    "/paginate",
    { preHandler: [restaurantAuth] },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const { page = "1", limit = "10" } = request.query as {
        page?: string;
        limit?: string;
      };

      const result = await paginateChefs({
        restaurantId,
        page: Number(page),
        limit: Number(limit) || 10,
      });

      return reply.send(result);
    })
  );
}
export default chefsManagementRoutes;
