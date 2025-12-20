import { Server, Socket } from "socket.io";
import { handleQRConnect, joinOrderRoom } from "../../libs/socketHandlers.ts";
 
export const orderTakerSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected (order taker):", socket.id);

    socket.on("qr_connect", (payload) => handleQRConnect(socket, io, "Order_Taker", payload));

    socket.on("create_order_room", ({ orderId }) => {
      joinOrderRoom(socket, orderId);
    });

    socket.on("order_status_update", ({ orderId, status }) => {
      const roomName = `order_${orderId}`;
      io.to(roomName).emit("status_update", { orderId, status });
    });
  });
};
