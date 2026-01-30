import { Server, Socket } from "socket.io";
import prisma from "../../libs/prisma.ts";
import { handleQRConnect, emitOrderUpdate, joinOrderRoom } from "../../libs/socketHandlers.ts";
import { updateOrder } from "../orders/orderTaker/updateOrder.ts";

export const chefSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected (chef):", socket.id);

    socket.on("qr_connect", (payload) => handleQRConnect(socket, io, "Chef", payload));

    socket.on("pick_order", async ({ orderId, chefId }) => {
      const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (!order) return socket.emit("error", "Order not found");

      const roomName = joinOrderRoom(socket, orderId);

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { chefId, status: "PICKED" },
      });

      io.to(roomName).emit("order_picked", { orderId, chefId, order: updatedOrder });
      io.to("admins").emit("admin_order_picked", { orderId, chefId, order: updatedOrder });
    });

    socket.on("order_updated", async ({ orderId, items, orderTakerId, chefId }) => {
      try {
        // Lookup chef's restaurantId for isolation
        const chef = await prisma.users.findUnique({
          where: { id: chefId },
          select: { restaurantId: true },
        });
        if (!chef) return socket.emit("error", "Chef not found");

        const updatedData = await updateOrder({
          orderId,
          items,
          restaurantId: chef.restaurantId, // ✅ required by UpdateOrderInput
        });

        const roomName = joinOrderRoom(socket, orderId);

        // Transform returned data
        const order = updatedData.orderItems;
        const changes = updatedData.changeLogs;

        emitOrderUpdate(io, roomName, orderId, order, changes, orderTakerId);
      } catch (err: any) {
        console.error("Error updating order for chef:", err);
        socket.emit("error", "Failed to update order");
      }
    });
  });
};
