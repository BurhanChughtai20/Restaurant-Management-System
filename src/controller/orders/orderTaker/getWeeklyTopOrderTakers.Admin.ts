import prisma from "../../../libs/prisma.ts";

export async function getWeeklyTopOrderTakers(restaurantId: number) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const grouped = await prisma.order.groupBy({
    by: ["orderTakerId"],
    where: {
      restaurantId, // 🔥 Ensure restaurant isolation
      createdAt: {
        gte: oneWeekAgo,
      },
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 3,
  });

  if (grouped.length === 0) return [];

  const users = await prisma.users.findMany({
    where: {
      restaurantId, // 🔥 Ensure restaurant isolation
      id: {
        in: grouped.map((g) => g.orderTakerId),
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      restaurantId: true,
      createdAt: true,
    },
  });

  return grouped.map((g) => {
    const user = users.find((u) => u.id === g.orderTakerId);
    return {
      orderTakerId: g.orderTakerId,
      name: user?.name,
      email: user?.email,
      totalOrders: g._count.id,
    };
  });
}
