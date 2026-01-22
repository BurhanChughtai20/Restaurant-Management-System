import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../libs/prisma.ts";
import { verifyToken } from "../utils/jwtToken.ts";

export async function restaurantAuth(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    const header = request.headers.authorization;
    if (!header) {
      return reply
        .status(401)
        .send({ error: "Unauthorized: Missing Authorization header" });
    }
    if (!header.startsWith("Bearer ")) {
      return reply
        .status(401)
        .send({ error: "Unauthorized: Must start with 'Bearer '" });
    }

    const token = header.slice(7);

    let decoded: any;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return reply.status(401).send({ error: "Unauthorized: Invalid token" });
    }

    const { userId, role } = decoded;
    const userRole = await prisma.userRole.findFirst({
      where: { userId, role, isActive: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            restaurantId: true,
            restaurant: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
    if (!userRole) {
      return reply.status(403).send({ error: "Forbidden: No active role" });
    }

    if (!userRole.user?.restaurantId) {
      return reply
        .status(403)
        .send({ error: "Forbidden: No restaurant access" });
    }

    (request as any).user = userRole.user;
    (request as any).restaurantId = userRole.user.restaurantId;
  } catch (error: any) {
    console.error("restaurantAuth error:", error?.message || error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}
