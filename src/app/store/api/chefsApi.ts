
import api from "./baseApi";
import {
  Chef,
  GetChefsResponse,
  PaginatedResponse,
  SearchParams,
  Stats,
  ChefConnection,
} from "./types";

/**
 * Chefs API endpoints
 * Manages chef staff with connection tracking and statistics
 */
export const chefsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all chefs (GET /chefs – main list for Chef page)
    getChefs: builder.query<GetChefsResponse, void>({
      query: () => "/chefs",
      providesTags: ["Chefs"],
    }),

    // Legacy: get all chefs from /chef
    getAllChefs: builder.query<Chef[], void>({
      query: () => "/chef",
      providesTags: ["Chefs"],
    }),

    // Get paginated chefs
    getPaginatedChefs: builder.query<
      PaginatedResponse<Chef>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/chef/paginate?page=${page}&limit=${limit}`,
      providesTags: ["Chefs"],
    }),

    // Search chefs
    searchChefs: builder.query<PaginatedResponse<Chef>, SearchParams>({
      query: ({ search = "", page = 1, limit = 10, isActive }) => {
        const params = new URLSearchParams({
          search,
          page: String(page),
          limit: String(limit),
        });
        if (isActive !== undefined) {
          params.append("isActive", String(isActive));
        }
        return `/chef/search?${params}`;
      },
      providesTags: ["Chefs"],
    }),

    // Get chef stats
    getChefStats: builder.query<Stats, void>({
      query: () => "/chef/chef/stats",
      providesTags: ["Stats"],
    }),

    // Get chef session token for QR (GET /chefs/token, Bearer auth)
    getChefToken: builder.query<{ sessionToken: string }, void>({
      query: () => "/chefs/token",
      providesTags: ["Chefs"],
    }),

    // Update chef (PATCH /chefs/token) – body: { chefId, name }
    updateChef: builder.mutation<
      Chef,
      { chefId: number; name: string }
    >({
      query: (body) => ({
        url: "/chefs/token",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Chefs"],
    }),

    // Delete chef connection (DELETE /chefs/token) – body: { connectionId }
    deleteChefConnectionToken: builder.mutation<
      { message: string },
      { connectionId: number }
    >({
      query: (body) => ({
        url: "/chefs/token",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Chefs"],
    }),

    // Generate QR token for chef (legacy)
    generateChefToken: builder.mutation<
      { token: string; qrCode: string },
      void
    >({
      query: () => ({
        url: "/chef/token-chef",
        method: "GET",
      }),
    }),

    // Update chef connection
    updateChefConnection: builder.mutation<
      ChefConnection,
      { chefId: number; fromTime?: string; toTime?: string }
    >({
      query: (body) => ({
        url: "/chef/token-chef",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Chefs"],
    }),

    // Delete chef connection
    deleteChefConnection: builder.mutation<
      { message: string },
      { chefId: number }
    >({
      query: (body) => ({
        url: "/chef/token-chef",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Chefs"],
    }),
  }),
});

export const {
  useGetChefsQuery,
  useGetAllChefsQuery,
  useGetPaginatedChefsQuery,
  useSearchChefsQuery,
  useGetChefStatsQuery,
  useLazyGetChefTokenQuery,
  useUpdateChefMutation,
  useDeleteChefConnectionTokenMutation,
  useGenerateChefTokenMutation,
  useUpdateChefConnectionMutation,
  useDeleteChefConnectionMutation,
} = chefsApi;
