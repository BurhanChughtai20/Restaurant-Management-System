import type { OrderItem } from "../index.ts";

export interface GetOrderTakersParams {
  restaurantId: number;
  limit?: number;
  cursorId?: number;
}

export interface SearchOrderTakerParams {
  restaurantId: number;
  search?: string;
  page: number;
  limit: number;
  isActive?: boolean;
}

export interface UpdateOrderTakerBody {
  orderTakerId: number;
  fromTime?: string;
  toTime?: string;
  isActive?: boolean;
  name?: string;
  email?: string;
}

export interface DeleteOrderTakerBody {
  orderTakerId: number;
  connectionId: number; 

}

export interface OrderTaker {
  id: number;
  name: string;
  email: string;
  restaurantId: number;
  createdAt: Date;
  isEmailVerified: boolean;
  waiterConnection: {
    id: number;
    orderTakerId: number | null;
    isActive: boolean;
    fromTime: string | null;
    toTime: string | null;
    createdAt: Date;
  } | null;
}

export interface PaginatedOrderTakers {
  data: OrderTaker[];
  nextCursor: number | null;
}

export interface UpdateOrderTakerParams {
  restaurantId: number;
  orderTakerId: number;
  fromTime?: string;
  toTime?: string;
}