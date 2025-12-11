import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CreateMenuItem } from "../controller/menu-itms/createMenuItem.ts";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

async function MenuItemsRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: MenuItem }>(
    "/",
    { preHandler: [fastify.authenticate] },

    async (
      request: FastifyRequest<{ Body: MenuItem }>,
      reply: FastifyReply
    ) => {
      try {
        return await CreateMenuItem(request, reply);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );
}

export default MenuItemsRoutes;
