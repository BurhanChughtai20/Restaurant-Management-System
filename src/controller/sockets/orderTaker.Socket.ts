import { Server, Socket } from "socket.io";
import prisma from "../../libs/prisma.ts";
import { handleQRConnect, joinOrderRoom, emitOrderUpdate } from "../../libs/socketHandlers.ts";
import { OrderStatus } from "@prisma/client";

export const orderTakerSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected (order taker):", socket.id);

     socket.on("qr_connect", (payload) =>
      handleQRConnect(socket, io, "Order_Taker", payload)
    );

     socket.on("create_order_room", async ({ orderId }: { orderId: number }) => {
      const roomName = joinOrderRoom(socket, orderId);

       const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (order) {
        io.to("admins").emit("admin_order_update", { orderId: order.id, order });
      }
    });

     socket.on(
  "order_status_update",
  async ({
    orderId,
    status,
  }: {
    orderId: number;
    status: OrderStatus;
  }) => {
    const roomName = `order_${orderId}`;

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    io.to(roomName).emit("status_update", { orderId, status });
    io.to("admins").emit("admin_order_status_update", { orderId, status });
  }
);

  });
};
