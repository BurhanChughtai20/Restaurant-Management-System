import type { FastifyInstance } from "fastify";
import { CreateMenuItem } from "../controller/menu-itms/admin/createMenuItem.ts";

interface MenuItemBody {
    name: string;
    price: number;
    description?: string;
}

async function MenuItemsRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: MenuItemBody }>(
    "/create-menu-item",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
        const createdMenuItem = await CreateMenuItem(request.body);
        return reply.status(201).send(createdMenuItem);
      try {
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );
}

export default MenuItemsRoutes;
