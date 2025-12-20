import { Server, Socket } from "socket.io";
import prisma from "./prisma.ts";
 
export type RoleType = "Chef" | "Order_Taker";

export interface QRConnectPayload {
  token: string;
  userId: number;
}

export async function handleQRConnect(socket: Socket, io: Server, role: RoleType, payload: QRConnectPayload) {
  const { token, userId } = payload;

  try {
    const userRole = await prisma.userRole.findFirst({
      where: { userId, role, isActive: true },
      include: { user: true },
    });

    if (!userRole) {
      socket.emit("qr_error", "Unauthorized");
      return;
    }

    if (role === "Chef") {
      await prisma.chefConnection.upsert({
        where: { chefId: userId },
        update: { sessionToken: token, socketId: socket.id, isActive: true },
        create: { chefId: userId, sessionToken: token, socketId: socket.id, isActive: true },
      });
    } else if (role === "Order_Taker") {
      await prisma.waiterConnection.upsert({
        where: { orderTakerId: userId },
        update: { sessionToken: token, socketId: socket.id, isActive: true },
        create: { orderTakerId: userId, sessionToken: token, socketId: socket.id, isActive: true },
      });
    }

    socket.emit("qr_success", { userData: userRole.user });
  } catch (err) {
    console.error(`${role} QR connect error:`, err);
    socket.emit("qr_error", "Server error");
  }
}

export function joinOrderRoom(socket: Socket, orderId: number) {
  const roomName = `order_${orderId}`;
  socket.join(roomName);
  return roomName;
}

export function emitOrderUpdate(io: Server, roomName: string, orderId: number, updatedOrder: any, changes: any, updatedBy?: number) {
  io.to(roomName).emit("order_updated", { orderId, updatedOrder, changes });
  io.to("admins").emit("admin_order_updated", { orderId, updatedOrder, changes, updatedBy });
}
