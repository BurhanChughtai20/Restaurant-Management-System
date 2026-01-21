export interface OrderItem {
  id: number;
  name: string;
  description?: string | null;
  quantity: number;
  price: number;
}
