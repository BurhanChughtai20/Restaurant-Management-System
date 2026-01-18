import { DASHBOARD_ROUTES } from "@/config/menuConfig";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MenuState {
  activeRoute: keyof typeof DASHBOARD_ROUTES;
}

const initialState: MenuState = {
  activeRoute: "dashboard",
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setActiveRoute: (
      state,
      action: PayloadAction<keyof typeof DASHBOARD_ROUTES>,
    ) => {
      state.activeRoute = action.payload;
    },
  },
});

export const { setActiveRoute } = menuSlice.actions;
export default menuSlice.reducer;
