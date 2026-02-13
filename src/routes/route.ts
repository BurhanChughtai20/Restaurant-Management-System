import type { FastifyInstance } from "fastify";

import authRoutes from "./auth.ts";
import orderTakerManagementRoutes from "./orderTakerManagementAdminRoutes.ts";
import chefsManagementRoutes from "./chefsManagementAdminRoutes.ts";
import MenuItemsAdminRoutes from "./MenuItems_Admin.ts";
import OrderTaker_Mobile_Routes from "./orders.Order_Taker.ts";
import MenuItems_Chef_Mobile_Routes from "./orders.Chef.ts";
import Orders_Admin_Routes from "./admin.orders.ts";
import whatsapp_bot_order_routes from "./whatsapp.bot.order.ts";
import { whatsappBotRoutes } from "./whatsapp.bot.ts";
import AdminOrdersRoutes from "./admin.orders.ts";
export async function registerRoutes(fastify: FastifyInstance) {
  const API_PREFIX = process.env.API_PREFIX || "/v1";

  const routes: { module: any; prefix: string }[] = [
    { module: authRoutes, prefix: `${API_PREFIX}/auth` },
    { module: MenuItemsAdminRoutes, prefix: `${API_PREFIX}/menu-items/admin` },
    { module: Orders_Admin_Routes, prefix: `${API_PREFIX}/orders/admin` },
    { module: orderTakerManagementRoutes, prefix: `${API_PREFIX}/waiter` },
    { module: chefsManagementRoutes, prefix: `${API_PREFIX}/chef` },
    {
      module: OrderTaker_Mobile_Routes,
      prefix: `${API_PREFIX}/mobile/order-taker`,
    },
    {
      module: MenuItems_Chef_Mobile_Routes,
      prefix: `${API_PREFIX}/menu-items/chef`,
    }, 
    { module: whatsapp_bot_order_routes, prefix: `${API_PREFIX}/whatsapp_bot` },
    { module: whatsappBotRoutes, prefix: `${API_PREFIX}` },
  ];
  await Promise.all(
    routes.map(({ module, prefix }) => fastify.register(module, { prefix })),
  );
}
