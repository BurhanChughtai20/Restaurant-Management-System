import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import menuReducer from "./slices/menuSlice";
import dashboardReducer from "./slices/dashboardSlice";
import authReducer from "./slices/authSlice";
 
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,

    // Feature slices
    menu: menuReducer,
    dashboard: dashboardReducer,
    user: authReducer,
  },

  // Adding RTK Query middleware for caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
