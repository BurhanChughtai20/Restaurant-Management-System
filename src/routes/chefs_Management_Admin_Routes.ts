import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { generateQRToken } from "../utils/generateQRToken.ts";
import { getChefStats } from "../controller/staff/chef/getChefStatsAdmin.ts";
import { deleteChefConnection } from "../controller/sockets/deleteChefConnection.ts";
import { updateChefConnection } from "../controller/sockets/updateChefConnection.ts";
import { getAllChefs } from "../controller/staff/chef/getAllChefs.ts";

interface UpdateChefBody {
  chefId: number;
  fromTime?: string;
  toTime?: string;
}

interface DeleteChefBody {
  chefId: number;
}

async function chefsManagementRoutes(fastify: FastifyInstance) {
  // ✅ List all chefs
  fastify.get(
    "/",
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const chefs = await getAllChefs();
        return reply.send(chefs);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  // ✅ Generate QR token
  fastify.get(
    "/token-chef",
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

  // ✅ Delete chef connection
  fastify.delete<{ Body: DeleteChefBody }>(
    "/token-chef",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const result = await deleteChefConnection(request, reply);
        return reply.send(result);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.patch<{ Body: UpdateChefBody }>(
    "/token-chef",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const { chefId, fromTime, toTime } = request.body;
        const updated = await updateChefConnection({
          chefId,
          ...(fromTime !== undefined && { fromTime }),
          ...(toTime !== undefined && { toTime }),
        });

        return reply.send({
          message: "Chef timing updated successfully",
          data: updated,
        });
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  // ✅ Get chef stats
  fastify.get(
    "/chef/stats",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const stats = await getChefStats(request, reply);
        return reply.send(stats);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );
}

export default chefsManagementRoutes;
