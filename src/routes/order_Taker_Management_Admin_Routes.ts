import type { FastifyInstance } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";
import {
  getMenuItemsForChef,
  getAllCompletedOrdersForChef,
  getChefReport,
  getWeeklyTopChefs,
} from "../controller/index.ts";
import type { MenuItemForChef } from "../controller/orders/chef/getMenuItemsForChef.ts";
import { AuthenticatedUser } from "../shared/index.ts";

async function Chef_Orders_Mobile_Routes(fastify: FastifyInstance) {
  function registerGet<T = any>(
    path: string,
    roles: Role[],
    handler: (
      restaurantId: number,
      user: AuthenticatedUser | undefined,
      query?: any
    ) => Promise<T>
  ) {
    fastify.get(path, { preHandler: [restaurantAuth, allowRoles(roles)] }, async (req, reply) => {
      const restaurantId = (req as any).restaurantId;
      const user = req.user as AuthenticatedUser | undefined;
      const query = (req.query as any) || {};
      const result = await handler(restaurantId, user, query);
      return reply.send(result);
    });
  }

  // Menu Items for Chef
  registerGet<MenuItemForChef[]>("/menu-items", [Role.Chef], (restaurantId) =>
    getMenuItemsForChef(restaurantId)
  );

  // Completed Orders for Chef
  registerGet("/completed-orders", [Role.Chef], (restaurantId, user) => {
    if (!user?.id) throw new Error("Unauthorized: Chef ID missing");
    return getAllCompletedOrdersForChef(restaurantId, user.id);
  });

  // Chef Performance Reports
  registerGet("/chef/reports", [Role.Chef], (restaurantId, user, query) => {
    if (!user?.id) throw new Error("Unauthorized: Chef ID missing");
    const period = query?.period || "daily";
    return getChefReport(restaurantId, user.id, period);
  });

  // Weekly Top Chefs (Admin Only)
  registerGet("/top-chefs/weekly", [Role.Admin], (restaurantId) =>
    getWeeklyTopChefs(restaurantId)
  );
}

export default Chef_Orders_Mobile_Routes;
