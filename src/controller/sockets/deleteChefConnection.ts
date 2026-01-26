import prisma from "../../libs/prisma.ts";
import type { DeleteChefInput } from "../../shared/interfaces/chef.interface.ts";

export const deleteChefConnection = async ({
  restaurantId,
  chefId,
}: DeleteChefInput) => {
   const chef = await prisma.users.findFirst({
    where: {
      id: chefId,
      restaurantId,
      userRoles: {
        some: { role: "Chef" },
      },
       select: { id: true }, 
    },
  });

  if (!chef) {
    throw new Error("UNAUTHORIZED_CHEF");
  } 

  try {
     await prisma.chefConnection.delete({
    where: { chefId },
  });
  } catch{
    throw new Error("Order Chefs connection not found");
  }

  return { message: "Chef connection deleted successfully" };
};
