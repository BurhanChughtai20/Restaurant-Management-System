import type { FastifyRequest, FastifyReply } from "fastify";
import { Role } from "@prisma/client";
import { ApiError } from "../utils/ApiError.ts";

interface AuthenticatedUser {
  id: number;
  role: Role;
  restaurantId: number;
}

export const allowRoles =
  (allowedRoles: Role[]) => {
    const roleSet = new Set<Role>(allowedRoles);

    return async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as AuthenticatedUser | undefined;

      if (!user) {
        throw new ApiError(401, "Unauthorized: Authentication required");
      }

      if (!user.role) {
        throw new ApiError(403, "Forbidden: Role not assigned");
      }

      // O(1) lookup
      if (!roleSet.has(user.role)) {
        throw new ApiError(403, "Forbidden: Insufficient permissions");
      }
    };
  };
