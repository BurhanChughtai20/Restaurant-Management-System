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
          where: { Chef_ID: userId },
          update: { sessionToken: token, socketId: socket.id, isActive: true },
          create: {
            Chef_ID: userId,
            sessionToken: token,
            socketId: socket.id,
            isActive: true,
          },
        });

        socket.emit("qr_success", { userData: userRole.user });
      } catch (err) {
        console.error("chefSocket error:", err);
        socket.emit("qr_error", "Server error");
      }
    });
  });
};
