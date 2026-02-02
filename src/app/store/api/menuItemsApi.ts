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
    getAdminMenuItems: builder.query<PaginatedMenuItems, Partial<GetAllMenuItemsParams>>({
      query: ({ restaurantId, cursorId, limit = 10 }) => ({
        url: "/menu-items/admin/menu-items",
        params: { restaurantId, cursorId, limit },
      }),
      providesTags: (result, _error, arg) => generateMenuItemTags(result, arg.restaurantId),
      // Consistent serialization is key for the selector to find the data
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}-${queryArgs.restaurantId ?? "unknown"}`,
      // Merge results if you want infinite scroll, otherwise remove merge
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
      keepUnusedDataFor: 60,
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
      query: ({ id, ...body }) => ({
        url: `/menu-items/admin/update-menu-item/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "MenuItem", id: arg.id },
        { type: "MenuItem", id: `LIST-${arg.restaurantId}` },
      ],
    }),
  }),
});

export const {
  useGetAdminMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
} = menuApi;