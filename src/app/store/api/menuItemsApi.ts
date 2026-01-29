// src/app/store/menuApi.ts
import { baseApi } from "./baseApi";
import { menuItemActions } from "../slices/menuItemSlice";
import {
  MenuItem,
  MenuItemBody,
  UpdateMenuItemBody,
  SearchMenuItemsParams,
  PaginatedMenuItems,
  DeleteMenuItemResponse,
  AdminMenuItemsResponse,
  AdminMenuItemsRequest,
} from "./types";

export const menuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Admin Menu Items (with pagination cursor)
    getAdminMenuItems: builder.query<
      AdminMenuItemsResponse,
      AdminMenuItemsRequest
    >({
      query: ({ cursor } = {}) => ({
        url: "/menu-items/admin/menu-items",
        params: cursor !== null ? { cursor } : {},
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // data.data is array of menu items
          dispatch(menuItemActions.setMenuItems(data.data));
          console.log("API data:", data);
        } catch (error) {
          console.error("Failed to fetch menu items:", error);
          dispatch(menuItemActions.setError("Could not load menu items"));
        }
      },
      providesTags: (result) =>
        result
          ? [
              { type: "MenuItems", id: "LIST" },
              ...result.data.map((item) => ({
                type: "MenuItems" as const,
                id: item.id,
              })),
            ]
          : [{ type: "MenuItems", id: "LIST" }],
    }),

    // POST: Create Menu Item
    createMenuItem: builder.mutation<MenuItem, MenuItemBody>({
      query: (body) => ({
        url: "/menu-items/admin/create-menu-item",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "MenuItems", id: "LIST" }],
    }),

    // PUT: Update Menu Item
    updateMenuItem: builder.mutation<
      { success: boolean; data: MenuItem },
      UpdateMenuItemBody & { id: number }
    >({
      query: ({ id, ...body }) => ({
        url: `/menu-items/admin/update-menu-item/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "MenuItems", id: arg.id },
      ],
    }),

    // DELETE: Menu Item
    deleteMenuItem: builder.mutation<DeleteMenuItemResponse, number>({
      query: (id) => ({
        url: `/menu-items/admin/delete-menu-item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "MenuItems", id: "LIST" }],
    }),

    // SEARCH Menu Items
    searchMenuItems: builder.query<PaginatedMenuItems, SearchMenuItemsParams>({
      query: (params) => ({
        url: "/menu-items/admin/search",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "MenuItems", id: "SEARCH" },
              ...result.data.map((item) => ({
                type: "MenuItems" as const,
                id: item.id,
              })),
            ]
          : [{ type: "MenuItems", id: "SEARCH" }],
    }),
  }),
});

export const {
  useGetAdminMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useSearchMenuItemsQuery,
} = menuApi;
