import { Order, OrderStatus } from "@prisma/client";

export function groupOrdersByPeriod(
  orders: Order[],
  period: "daily" | "weekly" | "monthly"
) {
  const map = new Map<string, Order[]>();

  for (const order of orders) {
    let key = "";
    const date = order.createdAt;

    if (period === "daily") {
      key = date.toISOString().split("T")[0] ?? "";
    }

    if (period === "weekly") {
      key = `${date.getFullYear()}-W${getWeekNumber(date)}`;
    }

    if (period === "monthly") {
      key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    }

    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(order);
  }

  return Array.from(map.entries()).map(([label, orders]) => {
    const completed = orders.filter(
      o => o.status === OrderStatus.COMPLETED
    );

    const avgCompletionTimeMinutes =
      completed.reduce((acc, o) => {
        return acc + (o.updatedAt.getTime() - o.createdAt.getTime());
      }, 0) /
      (completed.length || 1) /
      60000;

    return {
      label,
      totalOrders: orders.length,
      completedOrders: completed.length,
      avgCompletionTimeMinutes: Number(
        avgCompletionTimeMinutes.toFixed(2)
      )
    };
  });
}

function getWeekNumber(date: Date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const diff = (date.getTime() - firstDay.getTime()) / 86400000;
  return Math.ceil((diff + firstDay.getDay() + 1) / 7);
}
