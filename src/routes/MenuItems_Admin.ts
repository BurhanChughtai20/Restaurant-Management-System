import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CreateMenuItem } from "../controller/menu-itms/admin/createMenuItem.ts";
import { getAllMenuItems } from "../controller/menu-itms/admin/getAllMenuItems.ts";
import { updateMenuItem } from "../controller/menu-itms/admin/updateMenuItem.ts";
import { deleteMenuItem } from "../controller/menu-itms/admin/deleteMenuItem.ts";
import { searchMenuItems } from "../controller/menu-itms/admin/searchMenuItems.ts";
import { paginateMenuItems } from "../controller/menu-itms/admin/paginateMenuItems.ts";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";

interface MenuItemBody {
  name: string;
  price: number;
  description?: string;
}

interface UpdateMenuItemBody {
  name?: string;
  price?: number;
  description?: string;
  isActive?: boolean;
}

async function MenuItemsRoutes(fastify: FastifyInstance) {
  // Create Menu Item
  fastify.post<{ Body: MenuItemBody }>(
    "/create-menu-item",
    { preHandler: [restaurantAuth] },
    async (request, reply) => {
      const createdMenuItem = await CreateMenuItem({
        ...request.body,
        restaurantId: (request as any).restaurantId,
      });
      return reply.status(201).send(createdMenuItem);
    }
  );

  // Get All Menu Items
  fastify.get(
    "/",
    { preHandler: [restaurantAuth] },
    async (request, reply) => {
      const restaurantId = (request as any).restaurantId;
      const menuItems = await getAllMenuItems({ restaurantId });
      return reply.send(menuItems);
    }
  );

  // Update Menu Item
  fastify.patch<{ Body: UpdateMenuItemBody; Params: { id: string } }>(
    "/update-menu-item/:id",
    { preHandler: [restaurantAuth] },
    async (request, reply) => {
      const restaurantId = (request as any).restaurantId;
      const { id } = request.params;
      const { name, price, description, isActive } = request.body;

      const updatedMenuItem = await updateMenuItem({
        id: Number(id),
        restaurantId,
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      });

      return reply.send(updatedMenuItem);
    }
  );

  // Delete Menu Item
  fastify.delete<{ Params: { id: string } }>(
    "/delete-menu-item/:id",
    { preHandler: [restaurantAuth] },
    async (request, reply) => {
      const restaurantId = (request as any).restaurantId;
      const { id } = request.params;

      const result = await deleteMenuItem({
        id: Number(id),
        restaurantId,
      });
      return reply.send(result);
    }
  );

  // Search Menu Items
  fastify.get(
    "/search",
    { preHandler: [restaurantAuth] },
    async (request, reply) => {
      const restaurantId = (request as any).restaurantId;
      const query = request.query as any;

      const results = await searchMenuItems({
        restaurantId,
        search: query.search || "",
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        ...(query.isActive !== undefined && {
          isActive: query.isActive === "true",
        }),
      });

      return reply.send(results);
    }
  );

  // Paginate Menu Items
  fastify.get(
    "/paginate",
    { preHandler: [restaurantAuth] },
    async (request, reply) => {
      const restaurantId = (request as any).restaurantId;
      const query = request.query as any;

      const result = await paginateMenuItems({
        restaurantId,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
      });

      return reply.send(result);
    }
  );
}

export default MenuItemsRoutes;