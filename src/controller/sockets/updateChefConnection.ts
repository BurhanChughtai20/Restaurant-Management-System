import prisma from "../../libs/prisma.ts";

interface UpdateChefConnectionParams {
  chefId: number;
  fromTime?: string;
  toTime?: string;
}

export const updateChefConnection = async ({
  chefId,
  fromTime,
  toTime,
}: UpdateChefConnectionParams) => {
  const connection = await prisma.chefConnection.findUnique({
    where: { Chef_ID: chefId },
  });

  if (!connection) {
    throw new Error("Chef connection not found");
  }

  const updatedConnection = await prisma.chefConnection.update({
    where: { Chef_ID: chefId },
    data: {
      fromTime: fromTime ?? connection.fromTime,
      toTime: toTime ?? connection.toTime,
    },
  });

  return updatedConnection;
};
