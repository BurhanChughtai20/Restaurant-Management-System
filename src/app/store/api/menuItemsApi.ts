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
    createMenuItem: builder.mutation<MenuItem, MenuItemBody>({
      query: (body) => ({
        url: "/menu-items/admin/create-menu-item",
        method: "POST",
        body,
      }),
      async onQueryStarted(newItem, { dispatch, queryFulfilled }) {
        // Temporary frontend ID for optimistic update
        const tempId = Date.now();

        const patchResult = dispatch(
          menuApi.util.updateQueryData(
            "getAdminMenuItems",
            { cursor: undefined },
            (draft) => {
              draft.data.unshift({
                id: tempId,
                restaurantId: 0, 
                name: newItem.name,
                price: newItem.price,
                description: newItem.description ?? null,
                sku: "", 
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            },
          ),
        );

        try {
          const { data: returnedItem } = await queryFulfilled;

          dispatch(
            menuApi.util.updateQueryData(
              "getAdminMenuItems",
              { cursor: undefined },
              (draft) => {
                draft.data = [
                  returnedItem,
                  ...draft.data.filter((item) => item.id !== tempId),
                ];
              },
            ),
          );
        } catch {
          patchResult.undo(); // rollback on failure
        }
      },
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
