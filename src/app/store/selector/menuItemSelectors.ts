import { createSelector } from "@reduxjs/toolkit";
import { MenuItem, PaginatedMenuItems } from "../api/types";

// Safety check for RTK Query cache structure
const isPaginatedMenuItems = (data: unknown): data is PaginatedMenuItems => {
  return (
    !!data &&
    typeof data === 'object' &&
    'data' in data &&
    Array.isArray((data).data)
  );
};

const selectMenuQueries = (state: any) => state.api?.queries;

export const selectAllCachedMenuItems = createSelector(
  [selectMenuQueries],
  (queries): MenuItem[] => {
    if (!queries) return [];

    const allItems: MenuItem[] = [];
    
    // Filter only queries related to getAdminMenuItems
    Object.keys(queries).forEach((key) => {
      if (key.startsWith('getAdminMenuItems')) {
        const query = queries[key];
        if (query?.status === 'fulfilled' && isPaginatedMenuItems(query.data)) {
          allItems.push(...query.data.data);
        }
      }
    });

    // Unique items by ID
    const uniqueMap = new Map<number, MenuItem>();
    allItems.forEach(item => uniqueMap.set(item.id, item));
    
    return Array.from(uniqueMap.values());
  }
);

export const selectMenuItemsStats = createSelector(
  [selectAllCachedMenuItems],
  (items) => {
    const stats = items.reduce(
      (acc, item) => {
        acc.total++;
        item.isActive ? acc.active++ : acc.inactive++;
        acc.priceSum += item.price;
        return acc;
      },
      { total: 0, active: 0, inactive: 0, priceSum: 0 }
    );

    return {
      ...stats,
      avgPrice: stats.total > 0 ? parseFloat((stats.priceSum / stats.total).toFixed(2)) : 0,
    };
  }
);