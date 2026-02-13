import type { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import prisma from "../libs/prisma.ts";

export const generateQRToken = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const restaurantId = (req as any).restaurantId;
  const sessionToken = randomUUID();

  await prisma.waiterConnection.create({
    data: {
      restaurantId,
      sessionToken,
      isActive: false,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    },
  });

  return reply.send({ sessionToken });
};
