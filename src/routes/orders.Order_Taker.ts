import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";
import {
  getMenuItemsForOrderTaker,
  createOrder,
  updateOrder,
  get_All_Orders_OrderTakers,
  getOrderTakerReport,
} from "../controller/index.ts";
import type { AuthenticatedUserExtended, CreateOrderRequestBody } from "../shared/index.ts";
import { ApiError } from "../utils/ApiError.ts";

type RouteHandler<TResult> = (
  restaurantId: number,
  user: AuthenticatedUserExtended,
  query?: any
) => Promise<TResult>;

type PostHandler<TBody, TResult> = (
  restaurantId: number,
  user: AuthenticatedUserExtended,
  body: TBody
) => Promise<TResult>;

type PatchHandler<TBody, TResult> = (
  restaurantId: number,
  user: AuthenticatedUserExtended,
  params: any,
  body: TBody
) => Promise<TResult>;

function getRestaurantId(req: FastifyRequest): number {
  const restaurantId = (req as any).restaurantId;
  if (!restaurantId || typeof restaurantId !== 'number') {
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

function validateRequestBody<TBody>(body: unknown): asserts body is TBody {
  if (!body || typeof body !== 'object') {
    throw new ApiError(400, "Request body is required");
  }
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

  const registerPost = <TBody extends object = any, TResult = any>(
    path: string,
    roles: Role[],
    handler: PostHandler<TBody, TResult>
  ): void => {
    fastify.post<{ Body: TBody }>(
      path,
      { preHandler: [restaurantAuth, allowRoles(roles)] },
      async (req, reply) => {
        try {
          const restaurantId = getRestaurantId(req);
          const user = getAuthenticatedUser(req);
          
          validateRequestBody<TBody>(req.body);

          const result = await handler(restaurantId, user, req.body);
          return reply.status(201).send(result);
        } catch (err) {
          return handleRouteError(err, reply);
        }
      }
    );
  };

  const registerPatch = <TBody extends object = any, TResult = any>(
    path: string,
    roles: Role[],
    handler: PatchHandler<TBody, TResult>
  ): void => {
    fastify.patch<{ Body: TBody; Params: any }>(
      path,
      { preHandler: [restaurantAuth, allowRoles(roles)] },
      async (req, reply) => {
        try {
          const restaurantId = getRestaurantId(req);
          const user = getAuthenticatedUser(req);
          
          validateRequestBody<TBody>(req.body);

          const result = await handler(restaurantId, user, req.params, req.body);
          return reply.send(result);
        } catch (err) {
          return handleRouteError(err, reply);
        }
      }
    );
  };

  return { registerGet, registerPost, registerPatch };
}

async function OrderTaker_Orders_Mobile_Routes(fastify: FastifyInstance) {
  const { registerGet, registerPost, registerPatch } = createRouteRegistrar(fastify);

  registerGet(
    "/menu-items",
    [Role.Order_Taker],
    (restaurantId) => getMenuItemsForOrderTaker(restaurantId)
  );

  registerPost<CreateOrderRequestBody>(
    "/orders",
    [Role.Order_Taker],
    (restaurantId, user, body) =>
      createOrder({
        restaurantId,
        orderTakerId: user.id,
        items: body.items,
      }),
  );

  registerPatch<CreateOrderRequestBody>(
    "/orders/:id",
    [Role.Order_Taker],
    (restaurantId, user, params, body) => {
      const orderId = parseInt(params.id, 10);
      
      if (isNaN(orderId) || orderId <= 0) throw new ApiError(400, "Invalid order ID");

      return updateOrder({
        restaurantId,
        orderId,
        items: body.items,
      });
    }
  );

  registerGet(
    "/orders",
    [Role.Order_Taker],
    (restaurantId, user) => get_All_Orders_OrderTakers(restaurantId, user.id)
  );

  registerGet(
    "/order-taker/reports",
    [Role.Order_Taker],
    (restaurantId, user, query) => {
      const period = query?.period || "daily";
      
      const validPeriods = ["daily", "weekly", "monthly"];
      if (!validPeriods.includes(period)) {
        throw new ApiError(400, `Invalid period. Must be one of: ${validPeriods.join(", ")}`);
      }

      return getOrderTakerReport(restaurantId, user.id, period);
    }
  );
}

export default OrderTaker_Orders_Mobile_Routes;