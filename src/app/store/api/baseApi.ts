import { getToken } from "@/lib/tokenStore";
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/v1";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Skip token for login
    if (endpoint === "login") return headers;

    let token: string | null = null;

    if (typeof window !== "undefined") {
      token = getToken();
    }

    if (!token) {
      const reduxToken = (getState() as RootState).auth.token;
      if (reduxToken) token = reduxToken;
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && !result.error.data) {
    console.warn("Unauthorized! Redirecting...");
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Dashboard",
    "MenuItem",
    "Users",
    "OrderTakers",
    "Chefs",
    "Orders",
    "Articles",
    "WhatsAppOrders",
    "Stats",
  ],
  endpoints: () => ({}),
});

export default api;
