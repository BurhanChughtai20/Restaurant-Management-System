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


export interface DeleteChefInput {
  restaurantId: number;
  chefId: number;
}
