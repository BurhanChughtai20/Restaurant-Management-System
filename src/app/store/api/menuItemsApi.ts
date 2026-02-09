import { api } from "./baseApi";
import {
  MenuItem,
  MenuItemBody,
  UpdateMenuItemBody,
  GetAllMenuItemsParams,
  PaginatedMenuItems,
} from "./types";

const generateMenuItemTags = (
  result: PaginatedMenuItems | undefined,
  restaurantId?: number,
) => {
  const baseTags = [
    { type: "MenuItem" as const, id: "LIST" },
    ...(restaurantId ? [{ type: "MenuItem" as const, id: `LIST-${restaurantId}` }] : []),
  ];

  if (!result?.data) return baseTags;

  return [
    ...baseTags,
    ...result.data.map((item) => ({
      type: "MenuItem" as const,
      id: item.id,
    })),
  ];
};

export const menuApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminMenuItems: builder.query<PaginatedMenuItems, void>({
      query: () => ({
        url: "/menu-items/admin/menu-items",
      }),
      providesTags: (result) => generateMenuItemTags(result),
    }),

    createMenuItem: builder.mutation<MenuItem, MenuItemBody>({
      query: (body) => ({
        url: "/menu-items/admin/create-menu-item",
        method: "POST",
        body,
      }),
      // This forces the LIST to refresh so the new item shows up
      invalidatesTags: (_result, _error, arg) => [
        { type: "MenuItem", id: "LIST" },
        { type: "MenuItem", id: `LIST-${arg.restaurantId}` },
      ],
    }),

    updateMenuItem: builder.mutation<MenuItem, UpdateMenuItemBody & { id: number; restaurantId: number }>({
      query: ({ id, restaurantId, ...body }) => ({
        url: `/menu-items/admin/update-menu-item/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "MenuItem", id: arg.id },
        { type: "MenuItem", id: "LIST" },
        { type: "MenuItem", id: `LIST-${arg.restaurantId}` },
      ],
    }),

    deleteMenuItem: builder.mutation<{ message: string }, { id: number }>({
      query: ({ id }) => ({
        url: `/menu-items/admin/delete-menu-item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "MenuItem", id: arg.id },
        { type: "MenuItem", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAdminMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuApi;