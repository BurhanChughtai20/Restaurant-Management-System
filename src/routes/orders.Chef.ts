import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { getMenuItemsForChef } from "../controller/orders/chef/getMenuItemsForChef.ts";
import type { MenuItemForChef } from "../controller/orders/chef/getMenuItemsForChef.ts";
import { getAllCompletedOrdersForChef } from "../controller/orders/chef/getAllCompletedOrders.Chef.ts";
import { getChefReport } from "../controller/orders/chef/chefReport.service.ts";
import { getWeeklyTopChefs } from "../controller/orders/chef/getWeeklyTopChefs.Admin.ts";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";

async function Chef_Orders_Mobile_Routes(fastify: FastifyInstance) {
  fastify.get(
    "/menu-items",
    { preHandler: [restaurantAuth, allowRoles([Role.Chef])] },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const items: MenuItemForChef[] = await getMenuItemsForChef(restaurantId);
      return reply.send(items);
    })
  );

  fastify.get(
    "/completed-orders",
    { preHandler: [restaurantAuth, allowRoles([Role.Chef])] },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const user = request.user as { id: number };
      const chefId = user.id;

      if (!chefId) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const completedOrders = await getAllCompletedOrdersForChef(
        restaurantId,
        chefId
      );
      return reply.send(completedOrders);
    })
  );

  fastify.get(
    "/chef/reports",
    {
      preHandler: [restaurantAuth, allowRoles([Role.Chef])],
    },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const user = request.user as { id: number };
      const period = (request.query as any).period || "daily";

      const report = await getChefReport(
        restaurantId,
        user.id,
        period as "daily" | "weekly" | "monthly"
      );

      return reply.send(report);
    })
  );

  fastify.get(
    "/top-chefs/weekly",
    {
      preHandler: [restaurantAuth, allowRoles([Role.Admin])],
    },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const data = await getWeeklyTopChefs(restaurantId);
      return reply.send(data);
    })
  );
}

export default Chef_Orders_Mobile_Routes;
