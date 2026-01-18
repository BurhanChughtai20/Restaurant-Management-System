import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import menuReducer from "./slices/menuSlice";
import dashboardReducer from "./slices/dashboardSlice";
import userReducer from "./slices/userSlice";

/**
 * Redux store configuration with RTK Query
 * Centralizes all state management with automatic API caching
 */
export const store = configureStore({
  reducer: {
    // RTK Query API reducer
    [baseApi.reducerPath]: baseApi.reducer,

    // Feature slices
    menu: menuReducer,
    dashboard: dashboardReducer,
    user: userReducer,
  },

  // Adding RTK Query middleware for caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
