import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { generateQRToken } from "../controller/staff/generateQRToken.ts";
import { deleteChefConnection } from "../sockets/deleteChefConnection.ts";
import { updateChefConnection } from "../sockets/updateChefConnection.ts";
import { getChefStats } from "../controller/staff/getChefStatsAdmin.ts";
interface UpdateChefBody {
  chefId: number;
  fromTime: string;
  toTime: string;
}

interface DeleteChefBody {
  chefId: number;
}

async function chefsManagementRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/token-chef",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        return await generateQRToken(request, reply);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.delete<{ Body: DeleteChefBody }>(
    "/token-chef",
    async (request, reply) => {
      try {
        return await deleteChefConnection(request, reply);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.patch<{ Body: UpdateChefBody }>(
    "/token-chef",
    async (request, reply) => {
      try {
        const { chefId, fromTime, toTime } = request.body;
        const updated = await updateChefConnection({
          chefId,
          fromTime,
          toTime,
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

  fastify.get(
    "/chef/stats",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return await getChefStats(request, reply);
    }
  );
}

export default chefsManagementRoutes;
