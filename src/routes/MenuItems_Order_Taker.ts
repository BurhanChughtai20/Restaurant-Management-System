import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Role } from "@prisma/client";
import { allowRoles } from "../preHandler/roleGuard.ts";
import { getMenuItemsForOrderTaker } from "../controller/menu-itms/orderTaker/getMenuItems.ts";
import { createOrder } from "../controller/menu-itms/orderTaker/createOrder.ts";

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

async function OrderTakerRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/menu-items",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Order_Taker])],
    },
    async (_, reply: FastifyReply) => {
      try {
        const items = await getMenuItemsForOrderTaker();
        return reply.send(items);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.post<{ Body: CreateOrderRequestBody }>(
    "/orders",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Order_Taker])],
    },
    async (
      request: FastifyRequest<{ Body: CreateOrderRequestBody }>,
      reply: FastifyReply
    ) => {
      try {
        const user = request.user as AuthenticatedUser;
        const orderTakerId = user.id;
        if (!orderTakerId) {
          return reply.status(401).send({ error: "Unauthorized" });
        }

        const newOrder = await createOrder({
          orderTakerId,
          items: request.body.items,
        });

        return reply.status(201).send(newOrder);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );
}

export default OrderTakerRoutes;
