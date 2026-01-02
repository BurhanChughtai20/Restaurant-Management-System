import type { FastifyInstance } from "fastify";
import authRoutes from "./auth.ts";
import orderTakerManagementRoutes from "./order_Taker_Management_Admin_Routes.ts";
import chefsManagementRoutes from "./chefs_Management_Admin_Routes.ts";
import MenuItemsAdminRoutes from "./MenuItems_Admin.ts";
import OrderTaker_Mobile_Routes from "./orders.Order_Taker.ts";
import MenuItems_Chef_Mobile_Routes from "./orders.Chef.ts";
import Orders_Admin_Routes from "./admin.orders.ts";
import Article_Admin_Routes from "./article.admin.ts";
import whatsapp_bot_order_routes from "./whatsapp.bot.order.ts";
import { whatsappBotRoutes } from "./whatsapp.bot.ts";

export async function registerRoutes(fastify: FastifyInstance) {
  const API_PREFIX = process.env.API_PREFIX || "/api";

  await fastify.register(authRoutes, { prefix: `${API_PREFIX}/auth` });
  await fastify.register(orderTakerManagementRoutes, {
    prefix: `${API_PREFIX}/waiter`,
  });
  await fastify.register(chefsManagementRoutes, {
    prefix: `${API_PREFIX}/chef`,
  });
  await fastify.register(MenuItemsAdminRoutes, {
    prefix: `${API_PREFIX}/menu-items/admin`,
  });
  await fastify.register(OrderTaker_Mobile_Routes, {
    prefix: `${API_PREFIX}/menu-items/order-taker`,
  });
  await fastify.register(MenuItems_Chef_Mobile_Routes, {
    prefix: `${API_PREFIX}/menu-items/chef`,
  });
  await fastify.register(Orders_Admin_Routes, {
    prefix: `${API_PREFIX}/orders/admin`,
  });
  await fastify.register(Article_Admin_Routes, {
    prefix: `${API_PREFIX}/article`,
  });
  await fastify.register(whatsapp_bot_order_routes, {
    prefix: `${API_PREFIX}/whatsapp_bot`,
  });
  await fastify.register(whatsappBotRoutes, { prefix: `${API_PREFIX}` });
}
