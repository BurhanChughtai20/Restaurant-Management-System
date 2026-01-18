import { baseApi } from './baseApi';
import { MenuItem, PaginatedResponse, SearchParams } from './types';

/**
 * Menu Items API endpoints
 * Handles all menu item CRUD operations with automatic cache management
 */
export const menuItemsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all menu items
        getAllMenuItems: builder.query<MenuItem[], void>({
            query: () => '/menu-items/admin',
            providesTags: ['MenuItems'],
        }),

        // Get paginated menu items
        getPaginatedMenuItems: builder.query<
            PaginatedResponse<MenuItem>,
            { page?: number; limit?: number }
        >({
            query: ({ page = 1, limit = 10 }) =>
                `/menu-items/admin/paginate?page=${page}&limit=${limit}`,
            providesTags: ['MenuItems'],
        }),

        // Search menu items
        searchMenuItems: builder.query<PaginatedResponse<MenuItem>, SearchParams>({
            query: ({ search = '', page = 1, limit = 10, isActive }) => {
                const params = new URLSearchParams({
                    search,
                    page: String(page),
                    limit: String(limit),
                });
                if (isActive !== undefined) {
                    params.append('isActive', String(isActive));
                }
                return `/menu-items/admin/search?${params}`;
            },
            providesTags: ['MenuItems'],
        }),

        // Create menu item
        createMenuItem: builder.mutation<
            MenuItem,
            { name: string; price: number; description?: string }
        >({
            query: (body) => ({
                url: '/menu-items/admin/create-menu-item',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['MenuItems'],
        }),

        // Update menu item
        updateMenuItem: builder.mutation<
            MenuItem,
            {
                id: number;
                name?: string;
                price?: number;
                description?: string;
                isActive?: boolean;
            }
        >({
            query: ({ id, ...body }) => ({
                url: `/menu-items/admin/update-menu-item/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['MenuItems'],
        }),

        // Delete menu item
        deleteMenuItem: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/menu-items/admin/delete-menu-item/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['MenuItems'],
        }),
    }),
});

export const {
    useGetAllMenuItemsQuery,
    useGetPaginatedMenuItemsQuery,
    useSearchMenuItemsQuery,
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation,
} = menuItemsApi;
