import prisma from "../../libs/prisma.ts";
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
  orderTakerId: number;
  chefId?: number | null;
  status: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  items: AdminOrderItem[];
}

export async function getAllOrders(): Promise<AdminOrder[]> {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        select: {
          id: true,
          orderId: true,
          menuItemId: true,
          name: true,
          description: true,
          quantity: true,
          price: true,
          total: true
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
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
