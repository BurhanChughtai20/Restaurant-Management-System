import { Server, Socket } from "socket.io";
import prisma from "../../libs/prisma.ts";

export const orderTakerSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected (waiter):", socket.id);

    socket.on("qr_connect", async ({ token, userId }) => {
      try {
        const userRole = await prisma.userRole.findFirst({
          where: { userId, role: "Order_Taker", isActive: true },
          include: { user: true },
        });

        if (!userRole) {
          socket.emit("qr_error", "Unauthorized");
          return;
        }

        await prisma.waiterConnection.upsert({
          where: { orderTakerId: userId },
          update: { sessionToken: token, socketId: socket.id, isActive: true },
          create: { orderTakerId: userId, sessionToken: token, socketId: socket.id, isActive: true },
        });

        socket.emit("qr_success", { userData: userRole.user });
      } catch (err) {
        console.error("waiterSocket error:", err);
        socket.emit("qr_error", "Server error");
      }
    });

    // Waiter creates a new order → create a room with orderId
    socket.on("create_order_room", ({ orderId }) => {
      const roomName = `order_${orderId}`;
      socket.join(roomName);
      console.log(`Waiter ${socket.id} joined room ${roomName}`);
    });

    // Listen to status updates only for waiter’s orders
    socket.on("order_status_update", ({ orderId, status }) => {
      const roomName = `order_${orderId}`;
      io.to(roomName).emit("status_update", { orderId, status });
    });
  });
};
