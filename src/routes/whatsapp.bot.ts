import type { FastifyInstance } from "fastify";
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


  function registerAdminGet(
    path: string,
    handler: any,
  ) {
    fastify.get(path, {
      preHandler: [restaurantAuth, allowRoles(["Admin"])],
    }, handler);
  }

  function registerAdminPost(
    path: string,
    handler: any,
  ) {
    fastify.post(path, {
      preHandler: [restaurantAuth, allowRoles(["Admin"])],
    }, handler);
  }

  function registerPublicPost(
    path: string,
    handler: any,
  ) {
    fastify.post(path, handler);
  }

  // Register WhatsApp number
  registerAdminPost(
    "/admin/whatsapp/numbers",
    registerWhatsAppNumber,
  );

  // Get pending WhatsApp orders
  registerAdminGet(
    "/admin/whatsapp/orders/pending",
    getPendingWhatsAppOrders,
  );

  // Convert WhatsApp order to regular order
  registerAdminPost(
    "/admin/whatsapp/orders/complete",
    completeWhatsAppOrder,
  );


  // Client sends message
  registerPublicPost(
    "/whatsapp/message",
    handleClientMessage,
  );

  // Client places order
  registerPublicPost(
    "/whatsapp/order",
    handleOrderMessage,
  );
}
