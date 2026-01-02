import prisma from "../../libs/prisma.ts";
import { OrderStatus } from "@prisma/client";

export interface AdminOrderItem {
  id: number;
  name: string;
  description?: string | null;
  quantity: number;
  price: number;
  total: number;
}

export interface AdminOrder {
  id: number;
  restaurantId: number;
  orderTakerId: number | null;
  chefId?: number | null;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  items: AdminOrderItem[];
}

export async function getAllOrders(
  restaurantId: number
): Promise<AdminOrder[]> {
  const orders = await prisma.order.findMany({
    where: {
      restaurantId, // 🔥 Ensure restaurant isolation
    },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        select: {
          id: true,
          menuItemId: true,
          name: true,
          description: true,
          quantity: true,
          price: true,
          total: true,
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    restaurantId: order.restaurantId,
    orderTakerId: order.orderTakerId,
    chefId: order.chefId,
    status: order.status,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    })),
  }));
}
