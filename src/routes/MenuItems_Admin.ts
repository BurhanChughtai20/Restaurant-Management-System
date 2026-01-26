import type { FastifyInstance } from "fastify";
import {
  CreateMenuItem,
  getAllMenuItems,
  updateMenuItem,
  deleteMenuItem,
  searchMenuItems,
} from "../shared/index.ts";
import type {
  MenuItemBody,
  UpdateMenuItemBody,
} from "../shared/index.ts";
import { restaurantAuth } from "../middleware/restaurantAuth.ts";


async function MenuItemsRoutes(fastify: FastifyInstance) {
  function registerPost<T>(
    path: string,
    handler: (body: T, restaurantId: number) => Promise<any>,
  ) {
    fastify.post<{ Body: T }>(
      path,
      { preHandler: [restaurantAuth] },
      async (req, reply) => {
        const restaurantId = (req as any).restaurantId;
        const result = await handler(req.body as T, restaurantId);
        return reply.send(result);
      },
    );
  }
  function registerGet(
    path: string,
    handler: (restaurantId: number, query?: any) => Promise<any>,
  ) {
    fastify.get(path, { preHandler: [restaurantAuth] }, async (req, reply) => {
      const restaurantId = (req as any).restaurantId;
      const result = await handler(restaurantId, req.query);
      return reply.send(result);
    });
  }
  function registerPatch<T>(
    path: string,
    handler: (body: T, restaurantId: number, params: any) => Promise<any>,
  ) {
    fastify.patch<{ Body: T; Params: any }>(
      path,
      { preHandler: [restaurantAuth] },
      async (req, reply) => {
        const restaurantId = (req as any).restaurantId;
        const result = await handler(req.body as T, restaurantId, req.params);
        return reply.send(result);
      },
    );
  }
  function registerDelete(
    path: string,
    handler: (restaurantId: number, params: any) => Promise<any>,
  ) {
    fastify.delete<{ Params: any }>(
      path,
      { preHandler: [restaurantAuth] },
      async (req, reply) => {
        const restaurantId = (req as any).restaurantId;
        const result = await handler(restaurantId, req.params);
        return reply.send(result);
      },
    );
  }

  registerPost<MenuItemBody>("/create-menu-item", (body, restaurantId) =>
    CreateMenuItem({ ...body, restaurantId }),
  );

  registerGet("/menu-items", (restaurantId, query) =>
    getAllMenuItems({
      restaurantId,
      limit: Number(query?.limit) || 10,
      ...(query?.cursorId ? { cursorId: Number(query.cursorId) } : {}),
    }),
  );

  registerPatch<UpdateMenuItemBody>(
    "/update-menu-item/:id",
    (body, restaurantId, params) =>
      updateMenuItem({
        id: Number(params.id),
        restaurantId,
        ...(body.name !== undefined && { name: body.name }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      }),
  );

  registerDelete("/delete-menu-item/:id", (restaurantId, params) =>
    deleteMenuItem({ id: Number(params.id), restaurantId }),
  );

  registerGet("/search", (restaurantId, query) =>
    searchMenuItems({
      restaurantId,
      search: query?.search || "",
      page: Number(query?.page) || 1,
      limit: Number(query?.limit) || 10,
      ...(query?.isActive !== undefined && {
        isActive: query.isActive === "true",
      }),
    }),
  );
}

export default MenuItemsRoutes;
