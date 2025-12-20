import { OrderStatus } from "@prisma/client";
import prisma from "../../libs/prisma.ts";
import { getDateRange } from "../../utils/dateRanges.ts";
import { groupOrdersByPeriod } from "../../utils/groupOrdersByPeriod.ts";

type Period = "daily" | "weekly" | "monthly";

export async function getOrderTakerReport(
  orderTakerId: number,
  period: Period
) {
  const { start, end } = getDateRange(period);

  const orders = await prisma.order.findMany({
    where: {
      orderTakerId,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (o) => o.status === OrderStatus.COMPLETED
  );
  const updatedOrders = orders.filter(
    (o) => o.updatedAt.getTime() !== o.createdAt.getTime()
  );

  const avgCompletionTimeMinutes =
    completedOrders.reduce((acc, o) => {
      return acc + (o.updatedAt.getTime() - o.createdAt.getTime());
    }, 0) /
    (completedOrders.length || 1) /
    60000;

  const timeline = groupOrdersByPeriod(orders, period);

  return {
    summary: {
      totalOrders,
      completedOrders: completedOrders.length,
      updatedOrders: updatedOrders.length,
      avgCompletionTimeMinutes: Number(avgCompletionTimeMinutes.toFixed(2)),
    },
    timeline,
  };
}
