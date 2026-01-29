import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { menuItemsAdapterInstance, MenuItemsState } from "../slices/menuItemSlice";

// Properly typed slice selector
const selectMenuItemsState = (state: RootState) => state.menuItems as MenuItemsState;

const { selectAll, selectById, selectTotal } = menuItemsAdapterInstance.getSelectors(selectMenuItemsState);

export const selectAllMenuItems = selectAll;
export const selectMenuItemById = selectById;
export const selectMenuItemsTotal = selectTotal;

export const selectMenuItemsLoading = (state: RootState) => selectMenuItemsState(state).loading;
export const selectMenuItemsError = (state: RootState) => selectMenuItemsState(state).error;

export const selectSearchQuery = (state: RootState) => selectMenuItemsState(state).searchQuery;
export const selectFilterIsActive = (state: RootState) => selectMenuItemsState(state).filterIsActive;
export const selectCurrentPage = (state: RootState) => selectMenuItemsState(state).currentPage;
export const selectItemsPerPage = (state: RootState) => selectMenuItemsState(state).itemsPerPage;

export const selectActiveItemsCount = createSelector(selectAllMenuItems, items => items.filter(i => i.isActive).length);
export const selectInactiveItemsCount = createSelector(selectAllMenuItems, items => items.filter(i => !i.isActive).length);
export const selectAveragePrice = createSelector(selectAllMenuItems, items =>
  items.length ? items.reduce((sum, i) => sum + i.price, 0) / items.length : 0
);
export const selectMenuItemsStats = createSelector(
  [selectMenuItemsTotal, selectActiveItemsCount, selectInactiveItemsCount, selectAveragePrice],
  (total, active, inactive, avgPrice) => ({ total, active, inactive, avgPrice: Number(avgPrice.toFixed(2)) })
);

// Filtered & paginated
export const selectFilteredMenuItems = createSelector(
  [selectAllMenuItems, selectSearchQuery, selectFilterIsActive],
  (items, query, filter) => {
    let result = items;
    if (filter !== null) result = result.filter(i => i.isActive === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        i =>
          i.name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }
);

export const selectPaginatedMenuItems = createSelector(
  [selectFilteredMenuItems, selectCurrentPage, selectItemsPerPage],
  (items, page, perPage) => items.slice((page - 1) * perPage, page * perPage)
);

export const selectPaginationInfo = createSelector(
  [selectFilteredMenuItems, selectCurrentPage, selectItemsPerPage],
  (items, page, perPage) => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / perPage);
    return { currentPage: page, totalPages, totalItems, itemsPerPage: perPage, hasNextPage: page < totalPages, hasPreviousPage: page > 1 };
  }
);
