import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import api from './api/baseApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer, 
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
