import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CreateMenuItem } from "../controller/menu-itms/createMenuItem.ts";
import { getAllMenuItems } from "../controller/menu-itms/getAllMenuItems.ts";
import { updateMenuItem } from "../controller/menu-itms/updateMenuItem.ts";
import { deleteMenuItem } from "../controller/menu-itms/deleteMenuItem.ts";
import { searchMenuItems } from "../controller/menu-itms/searchMenuItems.ts";
import { paginateMenuItems } from "../controller/menu-itms/paginateMenuItems.ts";

interface MenuItemBody {
  name: string;
  price: number;
  description?: string;
}

interface UpdateMenuItemParams {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  isActive?: boolean;
}
interface DeleteMenuItemParams {
  id: string;
}

async function MenuItemsRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: MenuItemBody }>(
    "/create-menu-item",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const createdMenuItem = await CreateMenuItem(request.body);
        return reply.status(201).send(createdMenuItem);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.get(
    "/",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const menuItems = await getAllMenuItems();
        return reply.send(menuItems);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.patch<{ Body: UpdateMenuItemParams; Params: { id: string } }>(
    "/update-menu-item/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const { name, price, description, isActive } = request.body;

        const updatedMenuItem = await updateMenuItem({
          id: Number(id),
          ...(name !== undefined && { name }),
          ...(price !== undefined && { price }),
          ...(description !== undefined && { description }),
          ...(isActive !== undefined && { isActive }),
        });

        return reply.send(updatedMenuItem);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.delete<{ Params: DeleteMenuItemParams }>(
    "/delete-menu-item/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const result = await deleteMenuItem({ id: Number(id) });
        return reply.send(result);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.get(
    "/search",
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const {
          search = "",
          page = "1",
          limit = "10",
          isActive,
        } = request.query as {
          search?: string;
          page?: string;
          limit?: string;
          isActive?: string;
        };

        const results = await searchMenuItems({
          search,
          page: Number(page),
          limit: Number(limit),
          ...(isActive !== undefined && {
            isActive: isActive === "true",
          }),
        });

        return reply.send(results);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.get(
  "/paginate",
  { preHandler: [fastify.authenticate] },
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { page = "1", limit = "10" } = request.query as {
        page?: string;
        limit?: string;
      };

      const result = await paginateMenuItems({
        page: Number(page),
        limit: Number(limit) || 10, 
      });

      return reply.send(result);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
);

}

export default MenuItemsRoutes;
