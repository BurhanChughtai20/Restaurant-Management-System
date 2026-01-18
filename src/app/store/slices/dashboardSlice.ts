import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
  stats: Record<string, number>;
  notifications: string[];
}

const initialState: DashboardState = {
  stats: {},
  notifications: [],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<{ [key: string]: number }>) => {
      state.stats = action.payload;
    },
    addNotification: (state, action: PayloadAction<string>) => {
      state.notifications.push(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { setStats, addNotification, clearNotifications } = dashboardSlice.actions;
export default dashboardSlice.reducer;
