import { DashboardRouteKey } from "@/config/routes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MenuState {
  activeRoute: DashboardRouteKey;
}

const initialState: MenuState = {
  activeRoute: "dashboard",
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setActiveRoute: (state, action: PayloadAction<DashboardRouteKey>) => {
      state.activeRoute = action.payload;
    },
  },
});

export const { setActiveRoute } = menuSlice.actions;
export default menuSlice.reducer;
