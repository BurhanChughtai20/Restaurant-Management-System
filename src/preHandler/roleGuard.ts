import type { FastifyRequest, FastifyReply } from "fastify";
import { Role } from "@prisma/client";

export const allowRoles =
  (allowedRoles: Role[]) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.user as { allowedRoles: Role[] };
    const hasRole = userRole.allowedRoles.some((role) => allowedRoles.includes(role));
    if (!hasRole) throw new Error("Unauthorized");
  };
