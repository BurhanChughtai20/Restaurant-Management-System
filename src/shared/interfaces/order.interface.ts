import type { OrderItem } from "../../shared/index.ts";

export interface Order {
  id: number;
  items: OrderItem[];
}
