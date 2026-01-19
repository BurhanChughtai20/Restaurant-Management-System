import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1';

/**
 * Base API configuration for RTK Query
 * Centralizes all API calls with automatic caching and invalidation
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  // Add Auth to tagTypes for caching/invalidation
  tagTypes: [
    'Auth',          // <-- New tag for authentication related actions
    'MenuItems',
    'OrderTakers',
    'Chefs',
    'Orders',
    'Articles',
    'WhatsAppOrders',
    'Stats',
  ],
  endpoints: () => ({}),
});
