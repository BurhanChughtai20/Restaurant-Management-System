import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { allowRoles } from "../preHandler/roleGuard.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { createArticle } from "../controller/article/createArticle.ts";
import { getArticle } from "../controller/article/getArticle.ts";
import { updateArticle } from "../controller/article/updateArticle.ts";
import { deleteArticle } from "../controller/article/deleteArticle.ts";
import { searchArticle } from "../controller/article/searchArticle.ts";
import { autoCreateArticle } from "../controller/article/autoCreateArticle.ts";

interface CreateArticleBody {
  title: string;
  description: string;
  image?: string | Buffer;
  restaurantName: string;
  restaurantWebsite?: string;

  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  address?: string;
  mapLink?: string;
  phoneNumber?: string;
  openingHours?: string;
  socialLinks?: Record<string, string>;

  isPublished?: boolean;
}

interface UpdateArticleBody {
  title?: string;
  description?: string;
  image?: string | Buffer;
  restaurantName?: string;
  restaurantWebsite?: string;

  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  address?: string;
  mapLink?: string;
  phoneNumber?: string;
  openingHours?: string;
  socialLinks?: Record<string, string>;

  isPublished?: boolean; 
}

interface AutoArticleBody {
  title: string;
  restaurantName: string;
  keywords?: string;
  address?: string;
  mapLink?: string;
  phoneNumber?: string;
  image?: string | Buffer;
  isPublished?: boolean;
}


async function articleAdmin(fastify: FastifyInstance) {
  fastify.post<{ Body: CreateArticleBody }>(
    "/create",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Admin])],
    },
    asyncHandler(async (req, reply) => {
      const article = await createArticle(req);
      return reply.code(201).send(article);
    })
  );
  fastify.post<{ Body: AutoArticleBody }>(
  "/auto-create",
  {
    preHandler: [fastify.authenticate, allowRoles([Role.Admin])],
  },
  asyncHandler(async (req, reply) => {
    const article = await autoCreateArticle(req);
    return reply.code(201).send(article);
  })
);


  fastify.get(
  "/",
  {
    preHandler: [fastify.authenticate, allowRoles([Role.Admin])],
  },
  asyncHandler(async (req, reply) => {
    const page = parseInt((req.query as { page?: string })?.page ?? "1");
    const articles = await getArticle(page, 10);
    return reply.send(articles);
  })
);


  fastify.patch<{ Params: { id: string }; Body: UpdateArticleBody }>(
    "/:id",
    { preHandler: [fastify.authenticate, allowRoles([Role.Admin])] },
    asyncHandler(async (req, reply) => {
      const article = await updateArticle(req);
      return reply.send(article);
    })
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: [fastify.authenticate, allowRoles([Role.Admin])] },
    asyncHandler(async (req, reply) => {
      const { id } = req.params;
      const article = await deleteArticle(Number(id));
      return reply.send({ message: "Article deleted successfully", article });
    })
  );

  fastify.get(
    "/search",
    {
      preHandler: [fastify.authenticate, allowRoles([Role.Admin])],
    },
    asyncHandler(async (req, reply) => {
      const keyword = (req.query as { q?: string })?.q ?? "";
      const articles = await searchArticle(keyword);
      return reply.send(articles);
    })
  );
}

export default articleAdmin;
