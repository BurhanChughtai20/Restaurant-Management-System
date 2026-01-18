import { baseApi } from './baseApi';
import { OrderTaker, PaginatedResponse, SearchParams, Stats, WaiterConnection } from './types';

/**
 * Order Takers (Waiters) API endpoints
 * Manages waiter staff with connection tracking
 */
export const orderTakersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all order takers
        getAllOrderTakers: builder.query<OrderTaker[], void>({
            query: () => '/waiter',
            providesTags: ['OrderTakers'],
        }),

        // Get paginated waiters
        getPaginatedWaiters: builder.query<
            PaginatedResponse<OrderTaker>,
            { page?: number; limit?: number }
        >({
            query: ({ page = 1, limit = 10 }) =>
                `/waiter/waiters/paginate?page=${page}&limit=${limit}`,
            providesTags: ['OrderTakers'],
        }),

        // Search waiters
        searchWaiters: builder.query<PaginatedResponse<OrderTaker>, SearchParams>({
            query: ({ search = '', page = 1, limit = 10, isActive }) => {
                const params = new URLSearchParams({
                    search,
                    page: String(page),
                    limit: String(limit),
                });
                if (isActive !== undefined) {
                    params.append('isActive', String(isActive));
                }
                return `/waiter/waiters/search?${params}`;
            },
            providesTags: ['OrderTakers'],
        }),

        // Get order taker stats
        getOrderTakerStats: builder.query<Stats, void>({
            query: () => '/waiter/order-taker/stats',
            providesTags: ['Stats'],
        }),

        // Generate QR token for order taker
        generateOrderTakerToken: builder.mutation<
            { token: string; qrCode: string },
            void
        >({
            query: () => ({
                url: '/waiter/token-order-taker',
                method: 'GET',
            }),
        }),

        // Update order taker connection
        updateOrderTakerConnection: builder.mutation<
            WaiterConnection,
            { orderTakerId: number; fromTime?: string; toTime?: string }
        >({
            query: (body) => ({
                url: '/waiter/token-order-taker',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['OrderTakers'],
        }),

        // Delete order taker connection
        deleteOrderTakerConnection: builder.mutation<
            { message: string },
            { orderTakerId: number }
        >({
            query: (body) => ({
                url: '/waiter/token-order-taker',
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['OrderTakers'],
        }),
    }),
});

export const {
    useGetAllOrderTakersQuery,
    useGetPaginatedWaitersQuery,
    useSearchWaitersQuery,
    useGetOrderTakerStatsQuery,
    useGenerateOrderTakerTokenMutation,
    useUpdateOrderTakerConnectionMutation,
    useDeleteOrderTakerConnectionMutation,
} = orderTakersApi;
