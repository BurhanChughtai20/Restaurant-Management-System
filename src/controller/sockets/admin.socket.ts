import { Server, Socket } from "socket.io";

export const adminSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("Admin connected:", socket.id);

    socket.on("admin_join", () => {
      socket.join("admins");
    });
  });
};
