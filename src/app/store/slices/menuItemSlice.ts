import { createSlice } from "@reduxjs/toolkit";
import { MenuItem } from "../api/types";
import { createReusableAdapter } from "@/lib/createEntityAdapter";

const { adapter: menuItemsAdapter, initialState } =
  createReusableAdapter<MenuItem>();
export type MenuItemsState = typeof initialState;

const menuItemSlice = createSlice({
  name: "menuItems",
  initialState,
  reducers: {
    setMenuItems: (state, action) =>
      menuItemsAdapter.setAll(state, action.payload),
    addMenuItem: (state, action) =>
      menuItemsAdapter.addOne(state, action.payload),
    updateMenuItem: (state, action) =>
      menuItemsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      }),
    removeMenuItem: (state, action) =>
      menuItemsAdapter.removeOne(state, action.payload),
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { actions: menuItemActions, reducer: menuItemReducer } =
  menuItemSlice;

export const menuItemsAdapterInstance = menuItemsAdapter;
