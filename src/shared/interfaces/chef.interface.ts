export interface UpdateChefBody {
  chefId: number;
  fromTime?: string;
  toTime?: string;
}

export interface DeleteChefBody {
  chefId: number;
}
export interface GetAllChefsInput {
  restaurantId: number;
  limit?: number;
  cursorId?: number;
}

export interface PaginatedChefs {
  data: {
    id: number;
    name: string;
    email: string;
    restaurantId: number;
    isEmailVerified: boolean;
    createdAt: Date;
    waiterConnection: {
      id: number;
      orderTakerId: number;
      isActive: boolean;
      fromTime: string | null;
      toTime: string | null;
      createdAt: Date;
    } | null;
  }[];
  nextCursor: number | null;
}


export interface ChefInput {
  restaurantId: number;
  chefId: number;
}


export interface MenuItemForChef {
  id: number;
  name: string;
  description?: string | null;
  quantity?: number;
  orderId?: number;
}

export interface GetRestaurantIdForChef {
  restaurantId: number
}

export interface CompletedOrderItem {
  id: number;
  quantity: number;
  menuItem: {
    id: number;
    name: string;
    description?: string | null;
  };
}

export interface CompletedOrder {
  id: number;
  chefId: number;
  restaurantId: number;
  status: "COMPLETED";
  createdAt: Date;
  items: CompletedOrderItem[];
}
