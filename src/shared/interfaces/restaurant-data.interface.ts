import type { MenuItem, Order, Article } from "../../shared/index.ts";

export interface RestaurantData {
  menuItems: MenuItem[];
  orders: Order[];
  articles: Article[];
}
