import { Server, Socket } from "socket.io";
import prisma from "../../libs/prisma.ts";

export const chefSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected (chef):", socket.id);

    socket.on("qr_connect", async ({ token, userId }) => {
      try {
        const userRole = await prisma.userRole.findFirst({
          where: { userId, role: "Chef", isActive: true },
          include: { user: true },
        });

        if (!userRole) {
          socket.emit("qr_error", "Unauthorized");
          return;
        }

        await prisma.chefConnection.upsert({
          where: { chefId: userId },
          update: { sessionToken: token, socketId: socket.id, isActive: true },
          create: { chefId: userId, sessionToken: token, socketId: socket.id, isActive: true },
        });

        socket.emit("qr_success", { userData: userRole.user });
      } catch (err) {
        console.error("chefSocket error:", err);
        socket.emit("qr_error", "Server error");
      }
    });

    // Chef picks an order → join the same room as the waiter
    socket.on("pick_order", async ({ orderId, chefId }) => {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) return socket.emit("error", "Order not found");

      // Join room with waiter
      const roomName = `order_${orderId}`;
      socket.join(roomName);

      // Update order with chefId
      await prisma.order.update({
        where: { id: orderId },
        data: { chefId },
      });

      // Notify waiter and chef in the room
      io.to(roomName).emit("order_picked", { orderId, chefId });
    });

    // Chef updates status → send to room
    socket.on("update_status", ({ orderId, status }) => {
      const roomName = `order_${orderId}`;
      io.to(roomName).emit("status_update", { orderId, status });
    });
  });
};
