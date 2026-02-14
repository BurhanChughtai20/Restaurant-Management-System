import { Role } from "@prisma/client";
import prisma from "../../../libs/prisma.ts";
import { formatToTimezone } from "../../../utils/formatTime.ts";

export const connectChef = async ({
  sessionToken,
  chefId,
}: {
  sessionToken: string;
  chefId: number;
}) => {
  if (!sessionToken) throw new Error("sessionToken is required");
  if (!chefId) throw new Error("chefId is required");

  const connection = await prisma.chefConnection.findUnique({
    where: { sessionToken },
  });

  if (!connection) throw new Error("Invalid session token");

  const now = Date.now();
  if (connection.isActive && connection.chefId) {
    throw new Error("Connection already active");
  }
  if (connection.expiresAt.getTime() <= now) {
    throw new Error("Connection has expired");
  }

  const user = await prisma.users.findUnique({
    where: { id: chefId },
    include: { userRoles: true },
  });

  if (!user) throw new Error("User not found");

  if (user.restaurantId !== connection.restaurantId) {
    throw new Error(
      `User does not belong to this restaurant (user.restaurantId=${user.restaurantId}, connection.restaurantId=${connection.restaurantId})`,
    );
  }

  const activeRole = user.userRoles.find(
    (r) => r.role === Role.Chef && r.isActive,
  );

  if (!activeRole) {
    throw new Error("User does not have an active Chef role");
  }

  const updatedConnection = await prisma.chefConnection.update({
    where: { sessionToken },
    data: {
      isActive: true,
      chefId: user.id,
    },
  });

  return {
    success: true,
    message: "Chef connected successfully",
    chef: {
      id: user.id,
      name: user.name.trim(),
      email: user.email.trim(),
      restaurantId: user.restaurantId,
      isActive: updatedConnection.isActive,
      isEmailVerified: user.isEmailVerified,
      connectedAt: formatToTimezone(updatedConnection.updatedAt),
      sessionToken: updatedConnection.sessionToken.trim(),
    },
  };
};
