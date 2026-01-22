export interface MenuItem {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  sku: string;
}

export interface MenuItemBody {
  name: string;
  price: number;
  description?: string;
 }

export interface UpdateMenuItemBody {
  name?: string;
  price?: number;
  description?: string;
  isActive?: boolean;
}
export interface MenuItemParams {
  name: string;
  price: number;
  description?: string;
  restaurantId: number;
}

export interface UpdateMenuItemParams {
  id: number;
  restaurantId: number;
  name?: string;
  price?: number;
  description?: string;
  isActive?: boolean;
}

export interface DeleteMenuItemParams {
  id: number;
  restaurantId: number;  
}

export interface SearchMenuItemsParams {
  restaurantId: number;
  search?: string;
  page: number;
  limit: number;
  isActive?: boolean;
}
export interface PaginateParams {
  restaurantId: number;
  page: number;
  limit: number;
  cursorId: number;
}

export interface GetAllMenuItemsParams {
  restaurantId: number;
  limit?: number;
  cursorId?: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  restaurantId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedMenuItems {
  data: MenuItem[];
  nextCursor: number | null;
}
