import type{ FastifyInstance } from "fastify";
import {
  registerWhatsAppNumber,
  handleClientMessage,
  handleOrderMessage,
  getPendingWhatsAppOrders,
  completeWhatsAppOrder,
} from "../controller/WhatsAppBot/whatsappBotController.ts";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";
import { allowRoles } from "../preHandler/roleGuard.ts";

export async function whatsappBotRoutes(fastify: FastifyInstance) {
  // 🔥 ADMIN ROUTES - Register and manage WhatsApp numbers
  fastify.post(
    "/admin/whatsapp/numbers",
    { preHandler: [restaurantAuth, allowRoles(["Admin"])] },
    registerWhatsAppNumber
  );

  // 🔥 ADMIN ROUTE - Get pending WhatsApp orders for order takers
  fastify.get(
    "/admin/whatsapp/orders/pending",
    { preHandler: [restaurantAuth, allowRoles(["Admin"])] },
    getPendingWhatsAppOrders
  );

  // 🔥 ADMIN ROUTE - Convert WhatsApp order to regular order
  fastify.post(
    "/admin/whatsapp/orders/complete",
    { preHandler: [restaurantAuth, allowRoles(["Admin"])] },
    completeWhatsAppOrder
  );

  // 🔥 PUBLIC ROUTES - Client messaging (no auth required, but restaurantId must match registered number)
  // Client: POST /whatsapp/message { phoneNumber, message, restaurantId }
  fastify.post("/whatsapp/message", handleClientMessage);

  // Client: POST /whatsapp/order { phoneNumber, restaurantId, clientName, address, items }
  fastify.post("/whatsapp/order", handleOrderMessage);
}
