import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts";
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
  
  // Get Menu Items for Order Taker
  fastify.get(
    "/menu-items",
    { preHandler: [restaurantAuth, allowRoles([Role.Order_Taker])] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const items = await getMenuItemsForOrderTaker(restaurantId);
      return reply.send(items);
    }
  );

  // Create New Order
  fastify.post<{ Body: CreateOrderRequestBody }>(
    "/orders",
    { preHandler: [restaurantAuth, allowRoles([Role.Order_Taker])] },
    async (request, reply) => {
      const restaurantId = (request as any).restaurantId;
      const user = request.user as AuthenticatedUser;
      
      const orderTakerId = user?.id;
      if (!orderTakerId) {
        return reply.status(401).send({ error: "Unauthorized: User ID missing" });
      }

      const newOrder = await createOrder({
        restaurantId,
        orderTakerId,
        items: request.body.items,
      });

      return reply.status(201).send(newOrder);
    }
  );

  // Update Existing Order
  fastify.patch<{ Body: CreateOrderRequestBody; Params: { id: string } }>(
    "/orders/:id",
    { preHandler: [restaurantAuth, allowRoles([Role.Order_Taker])] },
    async (request, reply) => {
      const restaurantId = (request as any).restaurantId;
      const orderId = parseInt(request.params.id);

      if (isNaN(orderId)) {
        return reply.status(400).send({ error: "Invalid Order ID" });
      }

      const updatedOrder = await updateOrder({
        restaurantId,
        orderId,
        items: request.body.items,
      });

      return reply.send(updatedOrder);
    }
  );

  // Get All Orders for specific Order Taker
  fastify.get(
    "/orders",
    { preHandler: [restaurantAuth, allowRoles([Role.Order_Taker])] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const user = request.user as AuthenticatedUser;
      
      const orderTakerId = user?.id;
      if (!orderTakerId) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const orders = await get_All_Orders_OrderTakers(
        restaurantId,
        orderTakerId
      );
      return reply.send(orders);
    }
  );

 // Get Order Taker Performance Reports
  fastify.get(
    "/order-taker/reports",
    { preHandler: [restaurantAuth, allowRoles([Role.Order_Taker])] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const restaurantId = (request as any).restaurantId;
      const user = request.user as AuthenticatedUser;
      
      const { period = "daily" } = request.query as any;
      const report = await getOrderTakerReport(
        restaurantId, 
        user.id, 
        period
      );

      return reply.send(report);
    }
  );
}

export default OrderTaker_Orders_Mobile_Routes;