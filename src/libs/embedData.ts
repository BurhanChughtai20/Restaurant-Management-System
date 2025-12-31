import type { RestaurantData, MenuItem, Order, OrderItem, Article } from "../types/types.ts";

export function prepareVectors(data: RestaurantData, restaurantId: number) {
  const records: {
    id: string;
    chunk_text: string;
    metadata: Record<string, any>;
  }[] = [];

  data.menuItems.forEach((item: MenuItem) => {
    records.push({
      id: `menu-${item.id}`,
      chunk_text: `${item.name} - ${item.description ?? ""} - Price: ${item.price}`,
      metadata: { restaurantId, type: "menuItem", name: item.name, price: item.price, sku: item.sku },
    });
  });

  data.orders.forEach((order: Order) => {
    order.items.forEach((orderItem: OrderItem) => {
      records.push({
        id: `order-${orderItem.id}`,
        chunk_text: `${orderItem.name} - ${orderItem.description ?? ""} - Quantity: ${orderItem.quantity} - Price: ${orderItem.price}`,
        metadata: { restaurantId, type: "orderItem", orderId: order.id, name: orderItem.name, quantity: orderItem.quantity, price: orderItem.price },
      });
    });
  });

  data.articles.forEach((article: Article) => {
    records.push({
      id: `article-${article.id}`,
      chunk_text: `${article.title} - ${article.description}`,
      metadata: { restaurantId, type: "article", title: article.title },
    });
  });

  return records;
}
