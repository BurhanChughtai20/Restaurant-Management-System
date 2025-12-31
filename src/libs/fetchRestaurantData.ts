import prisma from "./prisma.ts";

export async function fetchRestaurantData(restaurantId: number) {
  const menuItems = await prisma.menuItem.findMany({
    where: { restaurantId, isActive: true },
  });

  const orders = await prisma.order.findMany({
    where: { restaurantId },
    include: {
      items: true,
    },
  });
  
  const articles = await prisma.article.findMany({
    where: { restaurantId, isPublished: true },
  });

  return { menuItems, orders, articles };
}
