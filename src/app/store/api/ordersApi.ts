import {api} from "./baseApi";
import { Order } from "./types";

interface TopOrderTaker {
  id: number;
  name: string;
  email: string;
  orderCount: number;
  totalRevenue: number;
}
export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all orders
    getAllOrders: builder.query<Order[], void>({
      query: () => "/orders/admin",
      providesTags: ["Orders"],
    }),

    // Get weekly top order takers
    getWeeklyTopOrderTakers: builder.query<TopOrderTaker[], void>({
      query: () => "/orders/admin/top-order-takers/weekly",
      providesTags: ["Stats"],
    }),
  }),
});

export const { useGetAllOrdersQuery, useGetWeeklyTopOrderTakersQuery } =
  ordersApi;
