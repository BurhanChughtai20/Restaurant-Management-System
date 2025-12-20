import type { FastifyInstance, FastifyReply } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts";
import { getMenuItemsForChef, MenuItemForChef } from "../controller/menu-itms/chef/getMenuItemsForChef.ts";

async function Chef_Orders_Mobile_Routes(fastify: FastifyInstance) {
  fastify.get("/menu-items",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Chef])],
    },
    async (_req, reply: FastifyReply) => {
      try {
        const items: MenuItemForChef[] = await getMenuItemsForChef();
        return reply.send(items);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  ); 
}

export default Chef_Orders_Mobile_Routes;