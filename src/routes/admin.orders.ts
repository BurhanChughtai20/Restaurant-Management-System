import type { FastifyInstance, FastifyReply } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts"; 
import { getAllOrders } from "../controller/orders/getAllOrders.Admin.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

async function AdminOrdersRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Admin])],
    },
    asyncHandler(async (_req, reply: FastifyReply) => {
      const orders = await getAllOrders();
      return reply.send(orders);
    })
  );
}

export default AdminOrdersRoutes;
