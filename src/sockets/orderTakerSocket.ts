import { Server, Socket } from "socket.io";
import prisma from "../libs/prisma.ts";

export const orderTakerSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);

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
          where: { Order_Taker_ID: userId },
          update: { sessionToken: token, socketId: socket.id, isActive: true},
          create: { Order_Taker_ID: userId, sessionToken: token, socketId: socket.id, isActive: true },
        });
        
        socket.emit("qr_success", { userData: userRole.user });
      } catch (err) {
        console.error(err);
        socket.emit("qr_error", "Server error");
      }
    });
  });
};
