import { Role } from "@prisma/client";
import prisma from "../../../libs/prisma.ts";

export const connectWaiter = async ({
  sessionToken,
  orderTakerId,
}: {
  sessionToken: string;
  orderTakerId: number;
}) => {
  // Validate input
  if (!sessionToken) throw new Error("sessionToken is required");
  if (!orderTakerId) throw new Error("orderTakerId is required");

  // Fetch waiter connection
  const connection = await prisma.waiterConnection.findUnique({
    where: { sessionToken },
  });

  if (!connection) throw new Error("Invalid session token");

  const now = Date.now();
  if (connection.isActive && connection.orderTakerId) {
    throw new Error("Connection already active");
  }
  if (connection.expiresAt.getTime() <= now) {
    throw new Error("Connection has expired");
  }

  // Fetch user along with roles
  const user = await prisma.users.findUnique({
    where: { id: orderTakerId },
    include: { userRoles: true },
  });

  if (!user) throw new Error("User not found");

  // Check restaurantId
  if (user.restaurantId !== connection.restaurantId) {
    throw new Error(
      `User does not belong to this restaurant (user.restaurantId=${user.restaurantId}, connection.restaurantId=${connection.restaurantId})`
    );
  }

  // Check active Order_Taker role
  const activeRole = user.userRoles.find(
    (r) => r.role === Role.Order_Taker && r.isActive
  );

  if (!activeRole) {
    throw new Error(
      "User does not have an active Order_Taker role"
    );
  }

  // Update waiter connection
  const updatedConnection = await prisma.waiterConnection.update({
    where: { sessionToken },
    data: {
      isActive: true,
      orderTakerId: user.id,
    },
  });

  return {
    success: true,
    message: "Waiter connected successfully",
    waiter: {
      id: user.id,
      name: user.name.trim(),
      email: user.email,
      restaurantId: user.restaurantId,
      isActive: updatedConnection.isActive,
      isEmailVerified: user.isEmailVerified,
      connectedAt: updatedConnection.updatedAt,
      sessionToken: updatedConnection.sessionToken,
    },
  };
};
