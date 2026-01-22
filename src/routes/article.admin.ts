// import { Role } from "@prisma/client";
// import type { FastifyInstance } from "fastify";
// import { allowRoles } from "../preHandler/roleGuard.ts";

// import{
//    CreateArticleBody,
//    AutoArticleBody,
//    UpdateArticleBody,
//   createArticle,
//   autoCreateArticle,
//   getArticle,
//   updateArticle,
//   searchArticle,
//   deleteArticle,
//   AuthenticatedUser,
// } from "../shared/index.ts";

// export default async function articleAdmin(fastify: FastifyInstance) {
  
//   // Generic POST route helper
//   function registerPost<T = any>(
//     path: string,
//     roles: Role[],
//     handler: (req: any, user?: AuthenticatedUser) => Promise<T>
//   ) {
//     fastify.post<{ Body: T }>(
//       path,
//       { preHandler: [fastify.authenticate, allowRoles(roles)] },
//       async (req, reply) => {
//         const user = req.user as AuthenticatedUser | undefined;
//         const result = await handler(req, user);
//         return reply.code(201).send(result);
//       }
//     );
//   }

//   // Generic GET route helper
//   function registerGet<T = any>(
//     path: string,
//     roles: Role[],
//     handler: (req: any, user?: AuthenticatedUser) => Promise<T>
//   ) {
//     fastify.get(
//       path,
//       { preHandler: [fastify.authenticate, allowRoles(roles)] },
//       async (req, reply) => {
//         const user = req.user as AuthenticatedUser | undefined;
//         const result = await handler(req, user);
//         return reply.send(result);
//       }
//     );
//   }

//   // Generic PATCH route helper
//   function registerPatch<T = any>(
//     path: string,
//     roles: Role[],
//     handler: (req: any, user?: AuthenticatedUser) => Promise<T>
//   ) {
//     fastify.patch<{ Body: T; Params: { id: string } }>(
//       path,
//       { preHandler: [fastify.authenticate, allowRoles(roles)] },
//       async (req, reply) => {
//         const user = req.user as AuthenticatedUser | undefined;
//         const result = await handler(req, user);
//         return reply.send(result);
//       }
//     );
//   }

//   // Generic DELETE route helper
//   function registerDelete(
//     path: string,
//     roles: Role[],
//     handler: (id: number, user?: AuthenticatedUser) => Promise<any>
//   ) {
//     fastify.delete<{ Params: { id: string } }>(
//       path,
//       { preHandler: [fastify.authenticate, allowRoles(roles)] },
//       async (req, reply) => {
//         const id = Number(req.params.id);
//         const user = req.user as AuthenticatedUser | undefined;
//         const result = await handler(id, user);
//         return reply.send({ message: "Deleted successfully", result });
//       }
//     );
//   }

//   // Routes
//   registerPost<CreateArticleBody>("/create", [Role.Admin], createArticle);
//   registerPost<AutoArticleBody>("/auto-create", [Role.Admin], autoCreateArticle);

//   registerGet("/", [Role.Admin], async (req) => {
//     const query = req.query as { page?: string };
//     const page = Number(query.page || 1);
//     return getArticle(page, 10);
//   });

//   registerPatch<UpdateArticleBody>("/:id", [Role.Admin], updateArticle);

//   registerDelete("/:id", [Role.Admin], deleteArticle);

//   registerGet("/search", [Role.Admin], async (req) => {
//     const query = req.query as { q?: string };
//     const keyword = query.q || "";
//     return searchArticle(keyword);
//   });
// }
