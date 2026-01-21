import { Role } from "@prisma/client";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { allowRoles } from "../preHandler/roleGuard.ts";

import type {
  CreateArticleBody,
  UpdateArticleBody,
  AutoArticleBody,
} from "../interfaces/article.types.ts";

import { createArticle } from "../controller/article/createArticle.ts";
import { getArticle } from "../controller/article/getArticle.ts";
import { updateArticle } from "../controller/article/updateArticle.ts";
import { deleteArticle } from "../controller/article/deleteArticle.ts";
import { searchArticle } from "../controller/article/searchArticle.ts";
import { autoCreateArticle } from "../controller/article/autoCreateArticle.ts";

export default async function articleAdmin(fastify: FastifyInstance) {
  // Create Article
  fastify.post<{ Body: CreateArticleBody }>(
    "/create",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Admin])],
    },
    async (req, reply) => {
      const article = await createArticle(req);
      return reply.code(201).send(article);
    },
  );

  // Auto Create Article
  fastify.post<{ Body: AutoArticleBody }>(
    "/auto-create",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Admin])],
    },
    async (req, reply) => {
      const article = await autoCreateArticle(req);
      return reply.code(201).send(article);
    },
  );

  // Get All Articles (Paginated)
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Admin])],
    },
    async (req, reply) => {
      const query = req.query as { page?: string };
      const page = Number(query.page || 1);

      const result = await getArticle(page, 10);
      return reply.send(result);
    },
  );

  // Update Article
  fastify.patch<{ Params: { id: string }; Body: UpdateArticleBody }>(
    "/:id",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Admin])],
    },
    async (req, reply) => {
      const result = await updateArticle(req);
      return reply.send(result);
    },
  );

  // Delete Article
  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Admin])],
    },
    async (req, reply) => {
      const id = Number(req.params.id);
      const article = await deleteArticle(id);
      return reply.send({ message: "Article deleted successfully", article });
    },
  );

  // Search Article
  fastify.get(
    "/search",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Admin])],
    },
    async (req, reply) => {
      const query = req.query as { q?: string };
      const keyword = query.q || "";

      const results = await searchArticle(keyword);
      return reply.send(results);
    },
  );
}
