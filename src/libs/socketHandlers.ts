import { Server, Socket } from "socket.io";
import prisma from "./prisma.ts";

export type RoleType = "Chef" | "Order_Taker";

export interface QRConnectPayload {
  token: string;
  userId: number;
  restaurantId: number;
}

// ---- Handle QR Connect ----
export async function handleQRConnect(
  socket: Socket,
  io: Server,
  role: RoleType,
  payload: QRConnectPayload
) {
  const { token, userId, restaurantId } = payload;

  try {
    const userRole = await prisma.userRole.findFirst({
      where: {
        userId,
        role,
        isActive: true,
        user: { restaurantId },
      },
      include: { user: true },
    });

    if (!userRole) {
      socket.emit("qr_error", "Unauthorized - invalid role or restaurant");
      return;
    }

    const connectionData = {
      sessionToken: token,
      socketId: socket.id,
      isActive: true,
    };

    if (role === "Chef") {
      await prisma.chefConnection.upsert({
        where: { chefId: userId },
        update: connectionData,
        create: { chefId: userId, ...connectionData },
      });
    } else {
      await prisma.waiterConnection.upsert({
        where: { orderTakerId: userId },
        update: connectionData,
        create: { orderTakerId: userId, ...connectionData },
      });
    }

    socket.emit("qr_success", { userData: userRole.user });
  } catch (err) {
    console.error(`${role} QR connect error:`, err);
    socket.emit("qr_error", "Server error");
  }
}

// ---- Join Socket Room ----
export function joinOrderRoom(socket: Socket, orderId: number) {
  const roomName = `order_${orderId}`;
  socket.join(roomName);
  return roomName;
}

// ---- Emit Order Update ----
export function emitOrderUpdate(
  io: Server,
  roomName: string,
  orderId: number,
  order: any,
  changes: any,
  updatedBy?: number
) {
  io.to(roomName).emit("order_updated", { orderId, updatedOrder: order, changes });
  io.to("admins").emit("admin_order_updated", { orderId, updatedOrder: order, changes, updatedBy });
}
