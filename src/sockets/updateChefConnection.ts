import prisma from "../libs/prisma.ts";

export const updateChefConnection = async ({
  chefId,
  fromTime,
  toTime,
}: {
  chefId: number;
  fromTime: string;
  toTime: string;
}) => {
  const connection = await prisma.chefConnection.findUnique({
    where: { Chef_ID: chefId },
  });

  if (!connection) {
    throw new Error("Chef connection not found");
  }

  const updatedConnection = await prisma.chefConnection.update({
    where: { Chef_ID: chefId },
    data: { fromTime, toTime },
  });

  return updatedConnection;
};
