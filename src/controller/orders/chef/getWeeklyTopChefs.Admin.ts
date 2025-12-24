import prisma from "../../../libs/prisma.ts";
import { OrderStatus } from "@prisma/client";

export async function getWeeklyTopChefs() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const grouped = await prisma.order.groupBy({
    by: ["chefId"],
    where: {
      chefId: { not: null },
      status: OrderStatus.COMPLETED,
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

  if (!grouped.length) return [];

  const chefs = await prisma.users.findMany({
    where: {
      id: {
        in: grouped.map(g => g.chefId!) ,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return grouped.map((g, index) => {
    const chef = chefs.find(c => c.id === g.chefId);
    return {
      rank: index + 1,
      chefId: g.chefId,
      name: chef?.name,
      email: chef?.email,
      totalCompletedOrders: g._count.id,
    };
  });
}
