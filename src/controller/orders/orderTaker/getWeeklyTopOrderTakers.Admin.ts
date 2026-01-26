import prisma from "../../../libs/prisma.ts";
import type { GetWeeklyTopOrderTakersParams, TopOrderTaker } from "../../../shared/index.ts";

export async function getWeeklyTopOrderTakers({restaurantId}: GetWeeklyTopOrderTakersParams): Promise<TopOrderTaker[]> {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 7);

  const type = "monthly";
  if(type === "monthly") {
    fromDate.setDate(fromDate.getDate() - 30);
  }

  const grouped = await prisma.order.groupBy({
    by:["orderTakerId"],
    where: {
      restaurantId,
      orderTakerId: {not: null},
      status: "COMPLETED",
      createdAt: {
        gte: fromDate
      },
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count : {id: "desc"},
    },
    take:3
  })

  if(grouped.length == 0) return [];

const ids = grouped
  .map(g => g.orderTakerId)
  .filter((id): id is number => id !== null);

const users = await prisma.users.findMany({
  where: {
    id: { in: ids },
  },
  select: {
    id: true,
    name: true,
    email: true,
  },
});
 
const userMap = new Map(users.map(u => [u.id, u]));

const result = grouped.map(g => {
  if (g.orderTakerId === null) return null;

  const user = userMap.get(g.orderTakerId);
  return {
    orderTakerId: g.orderTakerId,
    name: user?.name,
    email: user?.email,
    totalOrders: g._count.id,
  };
}).filter(Boolean);

return result as TopOrderTaker[];
}
