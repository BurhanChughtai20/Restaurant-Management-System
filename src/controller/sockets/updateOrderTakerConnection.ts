import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../libs/prisma.ts";

export const updateOrderTakerConnection = async ({
  orderTakerId,
  fromTime,
  toTime,
}: {
  orderTakerId: number;
  fromTime: string;
  toTime: string;
}) => {
  const connection = await prisma.waiterConnection.findUnique({
    where: { Order_Taker_ID: orderTakerId },
  });

  if (!connection) {
    throw new Error("Order Taker connection not found");
  }

  const updatedConnection = await prisma.waiterConnection.update({
    where: { Order_Taker_ID: orderTakerId },
    data: { fromTime, toTime },
  });

  return updatedConnection;
};
