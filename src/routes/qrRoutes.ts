import type { FastifyInstance } from "fastify";
import { generateQRToken } from "../controller/qr/generateQRToken.ts";
import { deleteOrderTakerConnection } from "../sockets/deleteOrderTakerConnection.ts";
import { updateOrderTakerConnection } from "../sockets/updateOrderTakerConnection.ts";

async function waitersManagementRoutes(fastify : FastifyInstance)  {

  fastify.get("/token-order-taker", generateQRToken);
  fastify.delete("/token-order-taker", deleteOrderTakerConnection);
 fastify.patch("/token-order-taker", async (request, reply) => {
  try {
    const { orderTakerId, fromTime, toTime } = request.body as {
      orderTakerId: number;
      fromTime: string;
      toTime: string;
    };

    const updated = await updateOrderTakerConnection({ orderTakerId, fromTime, toTime });
    return reply.send({ message: "Order Taker timing updated successfully", data: updated });
  } catch (error: any) {
    return reply.status(400).send({ error: error.message });
  }
});

};
export default waitersManagementRoutes;
