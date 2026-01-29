import { MenuItemsState } from "@/components/admin-dashboard/types";
import { createEntityAdapter, EntityId } from "@reduxjs/toolkit";

export function createReusableAdapter<T extends { id: EntityId; createdAt?: string }>() {
  const adapter = createEntityAdapter<T>({
    sortComparer: (a, b) => {
      const aDate = a.createdAt ?? "";
      const bDate = b.createdAt ?? "";
      return bDate.localeCompare(aDate);
    },
  });

  const initialState = adapter.getInitialState<MenuItemsState>({
    loading: false,
    error: null,
    searchQuery: "",
    filterIsActive: null,
    currentPage: 1,
    itemsPerPage: 10,
  });

  return { adapter, initialState };
}
