import type { FastifyInstance, FastifyReply } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts"; 
import { getAllOrders } from "../controller/orders/getAllOrders.ts";

async function AdminOrdersRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Admin])],
    },
    async (_req, reply: FastifyReply) => {
      try {
        const orders = await getAllOrders();
        return reply.send(orders);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );
}

export default AdminOrdersRoutes;
