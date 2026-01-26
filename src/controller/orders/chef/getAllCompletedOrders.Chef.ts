import prisma from "../../../libs/prisma.ts";
import type {
  ChefInput,
  CompletedOrder,
} from "../../../shared/interfaces/chef.interface.ts";

export async function getAllCompletedOrdersForChef(
  input: ChefInput,
): Promise<CompletedOrder[]> {
  const { restaurantId, chefId } = input;

  const chef = await prisma.users.findFirst({
    where: {
      id: chefId,
      restaurantId,
      userRoles: { some: { role: "Chef" } },
    },
  });

  if (!chef) {
    throw new Error("Unauthorized - Chef not in your restaurant");
  }

  const orders = await prisma.order.findMany({
    where: {
      restaurantId,
      chefId,
      status: "COMPLETED",
      users: { some: { id: chefId, userRoles: { some: { role: "Chef" } } } },
    },
    include: {
      items: {
        select: {
          id: true,
          quantity: true,
          menuItem: { select: { id: true, name: true, description: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders as CompletedOrder[];
}
