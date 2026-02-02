
import api from "./baseApi";
import {
  Chef,
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
    // Get all chefs
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

    // Generate QR token for chef
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
  useGetAllChefsQuery,
  useGetPaginatedChefsQuery,
  useSearchChefsQuery,
  useGetChefStatsQuery,
  useGenerateChefTokenMutation,
  useUpdateChefConnectionMutation,
  useDeleteChefConnectionMutation,
} = chefsApi;
