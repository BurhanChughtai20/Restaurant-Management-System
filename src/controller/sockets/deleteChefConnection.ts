import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../libs/prisma.ts";

export interface DeleteChefBody {
  chefId: number;
}

export const deleteChefConnection = async (
  req: FastifyRequest<{ Body: DeleteChefBody }>,
  reply: FastifyReply
) => {
  const { chefId } = req.body;
  const restaurantId = (req as any).restaurantId;

  try {
    // 🔥 Verify chef belongs to the restaurant
    const chef = await prisma.users.findFirst({
      where: {
        id: chefId,
        restaurantId,
        userRoles: {
          some: { role: "Chef" },
        },
      },
    });

    if (!chef) {
      return reply
        .status(403)
        .send({ message: "Unauthorized - Chef not in your restaurant" });
    }

    const connection = await prisma.chefConnection.findUnique({
      where: { chefId },
    });

    if (!connection) {
      return reply.status(404).send({ message: "Chef connection not found" });
    }

    await prisma.chefConnection.delete({
      where: { chefId },
    });

    return reply.send({ message: "Chef connection deleted successfully" });
  } catch (err) {
    console.error("deleteChefConnection error:", err);
    return reply.status(500).send({ message: "Server error" });
  }
};
