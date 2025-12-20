import prisma from "../../../libs/prisma.ts";

export async function getMenuItemsForOrderTaker() {
  return prisma.menuItem.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      price: true,
      description: true,
      sku: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}
