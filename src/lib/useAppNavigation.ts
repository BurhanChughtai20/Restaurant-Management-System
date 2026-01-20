// src/lib/useAppNavigation.ts
"use client";
import { useNavigation } from "./useNavigation";
import { AUTH_ROUTES, DASHBOARD_ROUTES, APP_ROUTES } from "@/config/routes";

export const useAppNavigation = () => ({
  auth: useNavigation(AUTH_ROUTES),
  dashboard: useNavigation(DASHBOARD_ROUTES),
  app: useNavigation(APP_ROUTES),
});
