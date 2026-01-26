import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";
import {
  getMenuItemsForChef,
  getAllCompletedOrdersForChef,
  getChefReport,
  getWeeklyTopChefs,
} from "../controller/index.ts";
import type { AuthenticatedUserExtended } from "../shared/index.ts";
import { ApiError } from "../utils/ApiError.ts";
import type { MenuItemForChef } from "../shared/interfaces/chef.interface.ts";

type RouteHandler<TResult> = (
  restaurantId: number,
  user: AuthenticatedUserExtended,
  query?: any
) => Promise<TResult>;

function getRestaurantId(req: FastifyRequest): number {
  const restaurantId = (req as any).restaurantId;
  if (!restaurantId || typeof restaurantId !== "number") {
    throw new ApiError(400, "Invalid restaurant context");
  }
  return restaurantId;
}

function getAuthenticatedUser(req: FastifyRequest): AuthenticatedUserExtended {
  const user = req.user as AuthenticatedUserExtended;
  if (!user?.id) {
    throw new ApiError(401, "Unauthorized: User authentication required");
  }
  return user;
}

function handleRouteError(err: unknown, reply: FastifyReply) {
  if (err instanceof ApiError) {
    return reply.status(err.statusCode).send({ error: err.message });
  }
  const error = err as any;
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || "Internal server error";
  return reply.status(statusCode).send({ error: message });
}

function createRouteRegistrar(fastify: FastifyInstance) {
  const registerGet = <TResult = any>(
    path: string,
    roles: Role[],
    handler: RouteHandler<TResult>
  ): void => {
    fastify.get(
      path,
      { preHandler: [restaurantAuth, allowRoles(roles)] },
      async (req, reply) => {
        try {
          const restaurantId = getRestaurantId(req);
          const user = getAuthenticatedUser(req);
          const query = (req.query as any) || {};
          const result = await handler(restaurantId, user, query);
          return reply.send(result);
        } catch (err) {
          return handleRouteError(err, reply);
        }
      }
    );
  };

  return { registerGet };
}

async function Chef_Orders_Mobile_Routes(fastify: FastifyInstance) {
  const { registerGet } = createRouteRegistrar(fastify);

  registerGet<MenuItemForChef[]>(
  "/menu-items",
  [Role.Chef],
  (restaurantId: number) => getMenuItemsForChef({ restaurantId })
);

  registerGet(
    "/completed-orders",
    [Role.Chef],
    (restaurantId, user) => getAllCompletedOrdersForChef({restaurantId, chefId: user.id})
  );

  registerGet(
    "/chef/reports",
    [Role.Chef],
    (restaurantId, user, query) => {
      const period = query?.period || "daily";
      const validPeriods = ["daily", "weekly", "monthly"];
      if (!validPeriods.includes(period)) {
        throw new ApiError(
          400,
          `Invalid period. Must be one of: ${validPeriods.join(", ")}`
        );
      }
      return getChefReport(restaurantId, user.id, period);
    }
  );

  registerGet(
    "/top-chefs/weekly",
    [Role.Admin],
    (restaurantId) => getWeeklyTopChefs(restaurantId)
  );
}

export default Chef_Orders_Mobile_Routes;
