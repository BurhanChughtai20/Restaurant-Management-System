import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts";
import { getAllOrders } from "../controller/orders/getAllOrders.Admin.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { getWeeklyTopOrderTakers } from "../controller/orders/orderTaker/getWeeklyTopOrderTakers.Admin.ts";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";

async function AdminOrdersRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      preHandler: [restaurantAuth, allowRoles([Role.Admin])],
    },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const orders = await getAllOrders(restaurantId);
      return reply.send(orders);
    })
  );

  fastify.get(
    "/top-order-takers/weekly",
    {
      preHandler: [restaurantAuth, allowRoles([Role.Admin])],
    },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const data = await getWeeklyTopOrderTakers(restaurantId);
      return reply.send(data);
    })
  );
}

export default AdminOrdersRoutes;
