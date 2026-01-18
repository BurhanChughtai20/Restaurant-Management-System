import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Base API configuration for RTK Query
 * Centralizes all API calls with automatic caching and invalidation
 */
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = typeof window !== 'undefined'
                ? localStorage.getItem('authToken')
                : null;

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: [
        'MenuItems',
        'OrderTakers',
        'Chefs',
        'Orders',
        'Articles',
        'WhatsAppOrders',
        'Stats'
    ],
    endpoints: () => ({}),
});
