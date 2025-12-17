import prisma from "../../libs/prisma.ts";

interface UpdateOrderTakerParams {
  orderTakerId: number;
  fromTime?: string;
  toTime?: string;
}

export const updateOrderTakerConnection = async ({
  orderTakerId,
  fromTime,
  toTime,
}: UpdateOrderTakerParams) => {
  const connection = await prisma.waiterConnection.findUnique({
    where: { orderTakerId },
  });

  if (!connection) {
    throw new Error("Order Taker connection not found");
  }

  const updatedConnection = await prisma.waiterConnection.update({
    where: { orderTakerId },
    data: { 
      fromTime: fromTime ?? connection.fromTime,
      toTime: toTime ?? connection.toTime,
    },
  });

  return updatedConnection;
};
