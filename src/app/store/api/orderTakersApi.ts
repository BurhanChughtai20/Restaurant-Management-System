import api from "./baseApi";
import {
  OrderTaker,
  GetWaitersResponse,
  PaginatedResponse,
  SearchParams,
  Stats,
  WaiterConnection,
} from "./types";

/**
 * Order Takers (Waiters) API endpoints
 * Manages waiter staff with connection tracking
 */
export const orderTakersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all order takers (GET /waiter, Bearer auth)
    getAllOrderTakers: builder.query<GetWaitersResponse, void>({
      query: () => "/waiter",
      providesTags: ["OrderTakers"],
    }),

    // Get paginated waiters
    getPaginatedWaiters: builder.query<
      PaginatedResponse<OrderTaker>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/waiter/waiters/paginate?page=${page}&limit=${limit}`,
      providesTags: ["OrderTakers"],
    }),

    // Search waiters
    searchWaiters: builder.query<PaginatedResponse<OrderTaker>, SearchParams>({
      query: ({ search = "", page = 1, limit = 10, isActive }) => {
        const params = new URLSearchParams({
          search,
          page: String(page),
          limit: String(limit),
        });
        if (isActive !== undefined) {
          params.append("isActive", String(isActive));
        }
        return `/waiter/waiters/search?${params}`;
      },
      providesTags: ["OrderTakers"],
    }),

    // Get order taker stats
    getOrderTakerStats: builder.query<Stats, void>({
      query: () => "/waiter/order-taker/stats",
      providesTags: ["Stats"],
    }),

    // Get waiter session token for QR (GET /waiter/token, Bearer auth)
    getWaiterToken: builder.query<{ sessionToken: string }, void>({
      query: () => "/waiter/token",
      providesTags: ["OrderTakers"],
    }),

    // Update waiter (PATCH /waiter/token) – body: { orderTakerId, name }
    updateWaiter: builder.mutation<
      OrderTaker,
      { orderTakerId: number; name: string }
    >({
      query: (body) => ({
        url: "/waiter/token",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["OrderTakers"],
    }),

    // Delete waiter connection (DELETE /waiter/token) – body: { connectionId: waiterConnection.id }
    deleteOrderTakerConnection: builder.mutation<
      { message: string },
      { connectionId: number }
    >({
      query: (body) => ({
        url: "/waiter/token",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["OrderTakers"],
    }),

    // Generate QR token for order taker
    generateOrderTakerToken: builder.mutation<
      { token: string; qrCode: string },
      void
    >({
      query: () => ({
        url: "/waiter/token-order-taker",
        method: "GET",
      }),
    }),

    // Update order taker connection (legacy /waiter/token-order-taker)
    updateOrderTakerConnection: builder.mutation<
      WaiterConnection,
      { orderTakerId: number; fromTime?: string; toTime?: string }
    >({
      query: (body) => ({
        url: "/waiter/token-order-taker",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["OrderTakers"],
    }),
  }),
});

export const {
  useGetAllOrderTakersQuery,
  useGetPaginatedWaitersQuery,
  useSearchWaitersQuery,
  useGetOrderTakerStatsQuery,
  useLazyGetWaiterTokenQuery,
  useUpdateWaiterMutation,
  useGenerateOrderTakerTokenMutation,
  useUpdateOrderTakerConnectionMutation,
  useDeleteOrderTakerConnectionMutation,
} = orderTakersApi;
