import type { FastifyInstance, FastifyReply } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { getMenuItemsForChef } from "../controller/orders/chef/getMenuItemsForChef.ts";
import type { MenuItemForChef } from "../controller/orders/chef/getMenuItemsForChef.ts";
import { getAllCompletedOrdersForChef } from "../controller/orders/chef/getAllCompletedOrders.Chef.ts";
import { getChefReport } from "../controller/orders/chef/chefReport.service.ts";
import { getWeeklyTopChefs } from "../controller/orders/chef/getWeeklyTopChefs.Admin.ts";

async function Chef_Orders_Mobile_Routes(fastify: FastifyInstance) {
  fastify.get(
    "/menu-items",
    { preHandler: [fastify.authenticate, allowRoles([Role.Chef])] },
    asyncHandler(async (_req, reply: FastifyReply) => {
      const items: MenuItemForChef[] = await getMenuItemsForChef();
      return reply.send(items);
    })
  );

  fastify.get(
    "/completed-orders",
    { preHandler: [fastify.authenticate, allowRoles([Role.Chef])] },
    asyncHandler(async (request, reply: FastifyReply) => {
      const user = request.user as { id: number };
      const chefId = user.id;

      if (!chefId) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const completedOrders = await getAllCompletedOrdersForChef(chefId);
      return reply.send(completedOrders);
    })
  );

  fastify.get(
    "/chef/reports",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Chef])],
    },
    asyncHandler(async (request, reply: FastifyReply) => {
      const user = request.user as { id: number };
      const period = (request.query as any).period || "daily";

      const report = await getChefReport(
        user.id,
        period as "daily" | "weekly" | "monthly"
      );

      return reply.send(report);
    })
  );

   fastify.get(
    "/top-chefs/weekly",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Admin])],
    },
    asyncHandler(async (_req, reply: FastifyReply) => {
      const data = await getWeeklyTopChefs();
      return reply.send(data);
    })
  );

}

export default Chef_Orders_Mobile_Routes;
