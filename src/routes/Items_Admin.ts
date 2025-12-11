import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CreateMenuItem } from "../controller/menu-itms/createMenuItem.ts";
import { getAllMenuItems } from "../controller/menu-itms/getAllMenuItems.ts";
import { updateMenuItem } from "../controller/menu-itms/updateMenuItem.ts";
import { deleteMenuItem } from "../controller/menu-itms/deleteMenuItem.ts";

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
        const { name, price, description } = request.body;

        const updatedMenuItem = await updateMenuItem({
          id: Number(id),
          ...(name !== undefined && { name }),
          ...(price !== undefined && { price }),
          ...(description !== undefined && { description }),
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
}

export default MenuItemsRoutes;
