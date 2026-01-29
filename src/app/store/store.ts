// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import dashboardReducer from "./slices/dashboardSlice";
import authReducer from "./slices/authSlice";
import { menuItemReducer } from "./slices/menuItemSlice";

const PERSIST_ACTION_PREFIX = "persist/";
const PERSIST_ACTION = `${PERSIST_ACTION_PREFIX}PERSIST`;
const REHYDRATE_ACTION = `${PERSIST_ACTION_PREFIX}REHYDRATE`;
const API_PATH = "api";
const IMMUTABILITY_WARNING_THRESHOLD = 128;

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    dashboard: dashboardReducer,
    auth: authReducer,
    menuItems: menuItemReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST_ACTION, REHYDRATE_ACTION],
        ignoredPaths: [API_PATH],
      },
      immutableCheck: {
        warnAfter: IMMUTABILITY_WARNING_THRESHOLD,
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
