import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { getMenuItemsForOrderTaker } from "../controller/orders/orderTaker/getMenuItems.ts";
import { createOrder } from "../controller/orders/orderTaker/createOrder.ts";
import { updateOrder } from "../controller/orders/orderTaker/updateOrder.ts";
import { get_All_Orders_OrderTakers } from "../controller/orders/orderTaker/get_All_Orders.OrderTakers.ts";
import { getOrderTakerReport } from "../controller/orders/orderTaker/orderTakerReport.service.ts";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";

interface OrderItemInput {
  menuItemId: number;
  quantity: number;
}

interface CreateOrderRequestBody {
  items: OrderItemInput[];
}

interface AuthenticatedUser {
  id: number;
  name?: string;
  email?: string;
}

async function OrderTaker_Orders_Mobile_Routes(fastify: FastifyInstance) {
  fastify.get(
    "/menu-items",
    { preHandler: [restaurantAuth, allowRoles([Role.Order_Taker])] },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const items = await getMenuItemsForOrderTaker(restaurantId);
      return reply.send(items);
    })
  );

  fastify.post<{ Body: CreateOrderRequestBody }>(
    "/orders",
    { preHandler: [restaurantAuth, allowRoles([Role.Order_Taker])] },
    asyncHandler(async (request, reply) => {
      const restaurantId = (request as any).restaurantId;
      const user = request.user as AuthenticatedUser;
      const orderTakerId = user.id;
      if (!orderTakerId)
        return reply.status(401).send({ error: "Unauthorized" });

      const newOrder = await createOrder({
        restaurantId,
        orderTakerId,
        items: request.body.items,
      });

      return reply.status(201).send(newOrder);
    })
  );

  fastify.patch<{ Body: CreateOrderRequestBody; Params: { id: string } }>(
    "/orders/:id",
    { preHandler: [restaurantAuth, allowRoles([Role.Order_Taker])] },
    asyncHandler(async (request, reply) => {
      const restaurantId = (request as any).restaurantId;
      const orderId = parseInt(request.params.id);
      const updatedOrder = await updateOrder({
        restaurantId,
        orderId,
        items: request.body.items,
      });

      return reply.status(200).send(updatedOrder);
    })
  );

  fastify.get(
    "/orders",
    { preHandler: [restaurantAuth, allowRoles([Role.Order_Taker])] },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const user = request.user as { id: number };
      const orderTakerId = user.id;

      if (!orderTakerId)
        return reply.status(401).send({ error: "Unauthorized" });

      const orders = await get_All_Orders_OrderTakers(
        restaurantId,
        orderTakerId
      );
      return reply.status(200).send(orders);
    })
  );

  fastify.get(
    "/order-taker/reports",
    {
      preHandler: [restaurantAuth, allowRoles([Role.Order_Taker])],
    },
    asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const user = request.user as { id: number };
      const period = (request.query as any).period || "daily";

      const report = await getOrderTakerReport(restaurantId, user.id, period);

      reply.send(report);
    })
  );
}

export default OrderTaker_Orders_Mobile_Routes;
