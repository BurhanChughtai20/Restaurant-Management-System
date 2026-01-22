import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts";
import { getAllOrders } from "../controller/orders/getAllOrders.Admin.ts";
import { getWeeklyTopOrderTakers } from "../controller/orders/orderTaker/getWeeklyTopOrderTakers.Admin.ts";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";

async function AdminOrdersRoutes(fastify: FastifyInstance) {
    function registerGet(
      path: string,
      handler: (
        restaurantId: number,
        query?: any,
        req?: any,
        reply?: any,
      ) => Promise<any>,
    ) {
      fastify.get(path, { preHandler: [restaurantAuth] }, async (req, reply) => {
        const restaurantId = (req as any).restaurantId;
        const result = await handler(restaurantId, req.query, req, reply);
        return reply.send(result);
      });
    }

 registerGet("/", (restaurantId, query) =>
  getAllOrders({
    restaurantId,
     limit: Math.min(Number(query?.limit) || 20, 100), 
    ...(query?.cursorId && { cursorId: Number(query.cursorId) }),
  })
);

registerGet("/top-orderTaker-Weekly", (restaurantId) =>
  getWeeklyTopOrderTakers({ restaurantId })
);
}

export default AdminOrdersRoutes;
