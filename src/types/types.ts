// src/types.ts

export interface MenuItem {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  sku: string;
}

export interface OrderItem {
  id: number;
  name: string;
  description?: string | null;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
}

export interface Article {
  id: number;
  title: string;
  description: string;
}

export interface RestaurantData {
  menuItems: MenuItem[];
  orders: Order[];
  articles: Article[];
}
