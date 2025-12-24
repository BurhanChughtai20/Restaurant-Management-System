import prisma from "../../../libs/prisma.ts";

export async function getWeeklyTopOrderTakers() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // 1️⃣ Group orders by orderTakerId
  const grouped = await prisma.order.groupBy({
    by: ["orderTakerId"],
    where: {
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
      id: {
        in: grouped.map(g => g.orderTakerId),
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return grouped.map(g => {
    const user = users.find(u => u.id === g.orderTakerId);
    return {
      orderTakerId: g.orderTakerId,
      name: user?.name,
      email: user?.email,
      totalOrders: g._count.id,
    };
  });
}
