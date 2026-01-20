import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts";
import { getMenuItemsForChef } from "../controller/orders/chef/getMenuItemsForChef.ts";
import type { MenuItemForChef } from "../controller/orders/chef/getMenuItemsForChef.ts";
import { getAllCompletedOrdersForChef } from "../controller/orders/chef/getAllCompletedOrders.Chef.ts";
import { getChefReport } from "../controller/orders/chef/chefReport.service.ts";
import { getWeeklyTopChefs } from "../controller/orders/chef/getWeeklyTopChefs.Admin.ts";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";

interface AuthenticatedUser {
  id: number;
}

async function Chef_Orders_Mobile_Routes(fastify: FastifyInstance) {
  
  // Get Menu Items for Chef
  fastify.get(
    "/menu-items",
    { preHandler: [restaurantAuth, allowRoles([Role.Chef])] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const items: MenuItemForChef[] = await getMenuItemsForChef(restaurantId);
      return reply.send(items);
    }
  );

  // Get Completed Orders for Chef
  fastify.get(
    "/completed-orders",
    { preHandler: [restaurantAuth, allowRoles([Role.Chef])] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const user = request.user as AuthenticatedUser;
      
      const chefId = user?.id;
      if (!chefId) {
        return reply.status(401).send({ error: "Unauthorized: Chef ID missing" });
      }

      const completedOrders = await getAllCompletedOrdersForChef(
        restaurantId,
        chefId
      );
      return reply.send(completedOrders);
    }
  );

  // Get Chef Performance Reports
  fastify.get(
    "/chef/reports",
    { preHandler: [restaurantAuth, allowRoles([Role.Chef])] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const user = request.user as AuthenticatedUser;
      
      // Query se period nikaalein aur typed cast karein jo service expect kar rahi hai
      const { period = "daily" } = request.query as any;

      const report = await getChefReport(
        restaurantId,
        user.id,
        period // Service file ki types ke mutabiq as any cast ho jayega internally
      );

      return reply.send(report);
    }
  );

  // Get Weekly Top Chefs (Admin Only)
  fastify.get(
    "/top-chefs/weekly",
    { preHandler: [restaurantAuth, allowRoles([Role.Admin])] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const data = await getWeeklyTopChefs(restaurantId);
      return reply.send(data);
    }
  );
}

export default Chef_Orders_Mobile_Routes;