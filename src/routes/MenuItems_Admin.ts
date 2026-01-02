import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CreateMenuItem } from "../controller/menu-itms/admin/createMenuItem.ts";
import { getAllMenuItems } from "../controller/menu-itms/admin/getAllMenuItems.ts";
import { updateMenuItem } from "../controller/menu-itms/admin/updateMenuItem.ts";
import { deleteMenuItem } from "../controller/menu-itms/admin/deleteMenuItem.ts";
import { searchMenuItems } from "../controller/menu-itms/admin/searchMenuItems.ts";
import { paginateMenuItems } from "../controller/menu-itms/admin/paginateMenuItems.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";
  
interface MenuItemBody { name: string; price: number; description?: string; }
interface UpdateMenuItemParams { id: string; name?: string; price?: number; description?: string; isActive?: boolean; }
interface DeleteMenuItemParams { id: string; }

async function MenuItemsRoutes(fastify: FastifyInstance) {

fastify.post<{ Body: MenuItemBody }>(
  "/create-menu-item",
  { preHandler: [restaurantAuth] },
  asyncHandler(async (request, reply) => {
    const createdMenuItem = await CreateMenuItem({
      ...request.body,
      restaurantId: (request as any).restaurantId,
    });
    return reply.status(201).send(createdMenuItem);
  })
);


  fastify.get(
  "/",
  { preHandler: [restaurantAuth] },
  asyncHandler(async (request, reply) => {
    const restaurantId = (request as any).restaurantId;
    const menuItems = await getAllMenuItems({ restaurantId });
    return reply.send(menuItems);
  })
);

  fastify.patch<{ Body: UpdateMenuItemParams; Params: { id: string } }>(
  "/update-menu-item/:id",
  { preHandler: [restaurantAuth] },
  asyncHandler(async (request, reply) => {
    const restaurantId = (request as any).restaurantId;
    const { id } = request.params;
    const { name, price, description, isActive } = request.body;

    const updatedMenuItem = await updateMenuItem({
      id: Number(id),
      restaurantId, // ✅ ensure user cannot update other restaurant's items
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price }),
      ...(description !== undefined && { description }),
      ...(isActive !== undefined && { isActive }),
    });

    return reply.send(updatedMenuItem);
  })
);


  fastify.delete<{ Params: DeleteMenuItemParams }>(
  "/delete-menu-item/:id",
  { preHandler: [restaurantAuth] },
  asyncHandler(async (request, reply) => {
    const restaurantId = (request as any).restaurantId;
    const { id } = request.params;

    const result = await deleteMenuItem({ id: Number(id), restaurantId }); // ✅ only delete own restaurant
    return reply.send(result);
  })
);


  fastify.get(
  "/search",
  { preHandler: [restaurantAuth] },
  asyncHandler(async (request, reply) => {
    const restaurantId = (request as any).restaurantId;
    const { search = "", page = "1", limit = "10", isActive } = request.query as any;

    const results = await searchMenuItems({
      restaurantId,
      search,
      page: Number(page),
      limit: Number(limit),
      ...(isActive !== undefined && { isActive: isActive === "true" }),
    });

    return reply.send(results);
  })
);

fastify.get(
  "/paginate",
  { preHandler: [restaurantAuth] },
  asyncHandler(async (request, reply) => {
    const restaurantId = (request as any).restaurantId;
    const { page = "1", limit = "10" } = request.query as any;

    const result = await paginateMenuItems({
      restaurantId,
      page: Number(page),
      limit: Number(limit) || 10,
    });

    return reply.send(result);
  })
);

}

export default MenuItemsRoutes;