import prisma from "../../../libs/prisma.ts";
import type { GetOrdersByOrderTakerInput } from "../../../shared/index.ts";
import type { Order as BaseOrder, OrderItem } from "../../../shared/index.ts";
import { formatToTimezone } from "../../../utils/formatTime.ts";

export async function getAllOrdersByOrderTaker(
  input: GetOrdersByOrderTakerInput & { timezone?: string }
): Promise<
  (BaseOrder & {
    totalItems: number;
    grandTotal: number;
    subtotalPerItem: { name: string; quantity: number; total: number }[];
    createdAtTime: string;
  })[]
> {
  const { restaurantId, orderTakerId, timezone } = input;

  const orderTaker = await prisma.users.findFirst({
    where: {
      id: orderTakerId,
      restaurantId,
      userRoles: { some: { role: "Order_Taker" } },
    },
    select: { id: true },
  });
  if (!orderTaker) throw new Error("Unauthorized");

  const orders = await prisma.order.findMany({
    where: { restaurantId, orderTakerId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return orders.map(order => {
    const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];

    const itemMap = new Map<string, { quantity: number; total: number }>();
    for (const item of items) {
      const name = item.name?.trim();
      if (!name) continue;

      const quantity = typeof item.quantity === "number" ? item.quantity : 0;
      const total = typeof item.total === "number" ? item.total : 0;

      const existing = itemMap.get(name);
      if (existing) {
        existing.quantity += quantity;
        existing.total += total;
      } else {
        itemMap.set(name, { quantity, total });
      }
    }

    const subtotalPerItem = Array.from(itemMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, data]) => ({
        name,
        quantity: data.quantity,
        total: parseFloat(data.total.toFixed(2)),
      }));

    const totalItems = subtotalPerItem.reduce((sum, i) => sum + i.quantity, 0);
    const grandTotal = parseFloat(subtotalPerItem.reduce((sum, i) => sum + i.total, 0).toFixed(2));

    return {
      id: order.id,
      restaurantId: order.restaurantId,
      orderTakerId: order.orderTakerId ?? null,
      chefId: order.chefId ?? null,
      status: order.status,
      totalAmount: parseFloat(order.totalAmount?.toFixed(2) ?? "0"),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: items.map(i => ({
        id: i.id,
        name: i.name?.trim() ?? "",
        description: i.description?.trim() ?? "",
        quantity: i.quantity ?? 0,
        price: parseFloat(i.price?.toFixed(2) ?? "0"),
        total: parseFloat(i.total?.toFixed(2) ?? "0"),
      })),
      totalItems,
      grandTotal,
      subtotalPerItem,
      createdAtTime: formatToTimezone(order.createdAt, timezone),
    };
  });
}
