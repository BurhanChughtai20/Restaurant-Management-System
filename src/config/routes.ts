// src/config/routes.ts
export const AUTH_ROUTES = {
  signup: "/signup",
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
} as const;
 

export const DASHBOARD_ROUTES = {
  dashboard: "/dashboard",
  MenuItem: "/dashboard/MenuItem",
  Order_Taker: "/dashboard/Order_Taker",
  Chef: "/dashboard/Chef",
  Article: "/dashboard/article",
  whatsapp_bot: "/dashboard/whatsapp_bot",
  profile: "/dashboard/profile",
  settings: "/dashboard/settings",
  help: "/dashboard/help",
} as const;

export type DashboardRouteKey = keyof typeof DASHBOARD_ROUTES;

export const APP_ROUTES = {
  home: "/",
  pricing: "/pricing",
} as const;

