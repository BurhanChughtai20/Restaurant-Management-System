import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuItem } from "../api/types";
import { createReusableAdapter } from "@/lib/createEntityAdapter";

const { adapter: menuItemsAdapter, initialState } =
  createReusableAdapter<MenuItem>({
    loading: false,
    error: null,
    searchQuery: "",
    filterIsActive: null,
    currentPage: 1,
    itemsPerPage: 10,
  });

export type MenuItemsState = typeof initialState;

const menuItemSlice = createSlice({
  name: "menuItems",
  initialState,
  reducers: {
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) =>
      menuItemsAdapter.setAll(state, action.payload),
    addMenuItem: (state, action: PayloadAction<MenuItem>) =>
      menuItemsAdapter.addOne(state, action.payload),
    updateMenuItem: (state, action: PayloadAction<Partial<MenuItem> & { id: number }>) =>
      menuItemsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      }),
    removeMenuItem: (state, action: PayloadAction<number>) =>
      menuItemsAdapter.removeOne(state, action.payload),
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    }
  },
});

export const { actions: menuItemActions, reducer: menuItemReducer } = menuItemSlice;
export const menuItemsAdapterInstance = menuItemsAdapter;