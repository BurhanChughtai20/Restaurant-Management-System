import type { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import prisma from "../libs/prisma.ts";
export const generateQRTokenChef = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const restaurantId = (req as any).restaurantId;
  const sessionToken = randomUUID();

  await prisma.chefConnection.create({
    data: {
      restaurantId,
      sessionToken,
      isActive: false,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    },
  });

  return reply.send({ sessionToken });
};
