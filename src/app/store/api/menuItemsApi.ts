import { baseApi } from './baseApi';
import { MenuItem, SearchParams } from './types';

export const menuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Admin Menu Items
    getAdminMenuItems: builder.query<{ data: MenuItem[]; nextCursor?: number }, void>({
      query: () => '/menu-items/admin/menu-items',
      providesTags: ['MenuItems'],
    }),

    // POST: Create Menu Item
    createMenuItem: builder.mutation<MenuItem, Partial<MenuItem>>({
      query: (body) => ({
        url: '/menu-items/admin/create-menu-item',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MenuItems'],
    }),

    // PUT: Update Menu Item
    updateMenuItem: builder.mutation<{ success: boolean; data: MenuItem }, Partial<MenuItem> & { id: number }>({
      query: ({ id, ...body }) => ({
        url: `/menu-items/admin/update-menu-item/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['MenuItems'],
    }),

    // DELETE: Delete Menu Item
    deleteMenuItem: builder.mutation<{ message: string; deletedItemId: number }, number>({
      query: (id) => ({
        url: `/menu-items/admin/delete-menu-item/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MenuItems'],
    }),

    // GET: Search
    searchMenuItems: builder.query<{ data: MenuItem[]; count: number }, SearchParams>({
      query: (params) => ({
        url: '/menu-items/admin/search',
        params,
      }),
      providesTags: ['MenuItems'],
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