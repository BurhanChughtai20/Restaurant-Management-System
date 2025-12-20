import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts"; 
import { asyncHandler } from "../utils/asyncHandler.ts"; 
import { getMenuItemsForOrderTaker } from "../controller/orders/orderTaker/getMenuItems.ts";
import { createOrder } from "../controller/orders/orderTaker/createOrder.ts";
import { updateOrder } from "../controller/orders/orderTaker/updateOrder.ts";
import { get_All_Orders_OrderTakers } from "../controller/orders/orderTaker/get_All_Orders.OrderTakers.ts";
import { getOrderTakerReport } from "../controller/orders/orderTaker/orderTakerReport.service.ts";
 
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
    { preHandler: [fastify.authenticate, allowRoles([Role.Order_Taker])] },
    asyncHandler(async (_, reply: FastifyReply) => {
      const items = await getMenuItemsForOrderTaker();
      return reply.send(items);
    })
  );

  fastify.post<{ Body: CreateOrderRequestBody }>(
    "/orders",
    { preHandler: [fastify.authenticate, allowRoles([Role.Order_Taker])] },
    asyncHandler(async (request, reply) => {
      const user = request.user as AuthenticatedUser;
      const orderTakerId = user.id;
      if (!orderTakerId) return reply.status(401).send({ error: "Unauthorized" });

      const newOrder = await createOrder({
        orderTakerId,
        items: request.body.items,
      });

      return reply.status(201).send(newOrder);
    })
  );

  fastify.patch<{ Body: CreateOrderRequestBody; Params: { id: string } }>(
    "/orders/:id",
    { preHandler: [fastify.authenticate, allowRoles([Role.Order_Taker])] },
    asyncHandler(async (request, reply) => {
      const orderId = parseInt(request.params.id);
      const updatedOrder = await updateOrder({
        orderId,
        items: request.body.items,
      });

      return reply.status(200).send(updatedOrder);
    })
  );

  fastify.get(
    "/orders",
    { preHandler: [fastify.authenticate, allowRoles([Role.Order_Taker])] },
    asyncHandler(async (request, reply) => {
      const user = request.user as { id: number };
      const orderTakerId = user.id;

      if (!orderTakerId) return reply.status(401).send({ error: "Unauthorized" });

      const orders = await get_All_Orders_OrderTakers(orderTakerId);
      return reply.status(200).send(orders);
    })
  );

  fastify.get(
    "/order-taker/reports",
    {
      preHandler: [
        fastify.authenticate,
        allowRoles([Role.Order_Taker])
      ],
    },
    asyncHandler(async (request, reply) => {
      const user = request.user as { id: number };
      const period =
        (request.query as any).period || "daily";

      const report = await getOrderTakerReport(
        user.id,
        period
      );

      reply.send(report);
    })
  );
}

export default OrderTaker_Orders_Mobile_Routes;
