import React from 'react';
import { render as rtlRender, waitFor, screen, fireEvent, RenderResult } from '@testing-library/react';
import { configureStore, combineReducers, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { baseApi } from '@/app/store/api/baseApi';
import menuReducer from '@/app/store/slices/menuSlice';
import dashboardReducer from '@/app/store/slices/dashboardSlice';
import userReducer from '@/app/store/slices/authSlice';
import type { RootState } from '@/app/store/store';

// Type for partial Redux state
type PartialRootState = Partial<RootState>;

// Constant for loading spinner selector
const LOADING_SPINNER_SELECTOR = '.MuiCircularProgress-root';

// Combine all reducers
const appReducers = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  menu: menuReducer,
  dashboard: dashboardReducer,
  user: userReducer,
});

// Factory function to create a Redux test store
export function createTestStore(initialState?: PartialRootState): EnhancedStore<RootState> {
  return configureStore({
    reducer: appReducers,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(baseApi.middleware),
  });
}

export type AppStore = ReturnType<typeof createTestStore>;

// Type for render result including the store
type RenderWithStoreReturn = RenderResult & { store: AppStore };

// Options for the render helper
interface RenderHelperOptions {
  initialState?: PartialRootState;
  store?: AppStore;
}

// Render helper wrapping UI with Redux provider
export function renderWithProviders(
  ui: React.ReactElement,
  { initialState, store = createTestStore(initialState), ...options }: RenderHelperOptions = {}
): RenderWithStoreReturn {
  const Wrapper = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;
  const renderedResult = rtlRender(ui, { wrapper: Wrapper, ...options });
  return { ...renderedResult, store };
}

// Wait until the loading spinner disappears
export async function waitForLoadingToDisappear(): Promise<void> {
  await waitFor(() => {
    const spinner = document.querySelector(LOADING_SPINNER_SELECTOR);
    expect(spinner).not.toBeInTheDocument();
  });
}

// Re-export Testing Library utilities
export { screen, fireEvent, waitFor };
export type { RenderWithStoreReturn };
