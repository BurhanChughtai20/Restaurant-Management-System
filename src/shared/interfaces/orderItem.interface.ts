import { OrderStatus } from "@prisma/client";

export interface Order {
  id: number;
  items: OrderItem[];
}
export interface OrderItem {
  id: number;
  name: string;
  description?: string | null;
  quantity: number;
  price: number;
  total?: number; // optional
}

export interface AdminOrderItem {
  id: number;
  orderId: number;           // Add this!
  menuItemId: number;
  name: string;
  description: string | null;
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

export interface GetAllOrdersParams {
  restaurantId: number;
  limit?: number;
  cursorId?: number;
}

export interface GetWeeklyTopOrderTakersParams {
  restaurantId: number;
  limit?: number;
  cursorId?: number;
}

export interface TopOrderTaker {
  orderTakerId: number;
  name?: string;
  email?: string;
  totalOrders: number;
}


export interface OrderItemInput {
  menuItemId: number;
  quantity: number;
}

export interface CreateOrderRequestBody {
  items: OrderItemInput[];
}


export interface OrderItemInput {
  menuItemId: number;
  quantity: number;
}

export interface CreateOrderInput {
  restaurantId: number;
  orderTakerId: number;
  items: OrderItemInput[];
}

export interface OrderItemUpdateInput {
  price: any;
  description: null;
  name: any;
  menuItemId: number;
  quantity: number;
}

export interface UpdateOrderInput {
  restaurantId: number;
  orderId: number;
  items: OrderItemInput[]; // keep only client fields
}

export interface OrderChangeMessage {
  type: "ADDED" | "UPDATED" | "REMOVED";
  message: string;
}

export interface GetOrdersByOrderTakerInput {
  restaurantId: number;
  orderTakerId: number;
}
