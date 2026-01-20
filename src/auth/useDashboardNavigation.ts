// src/dashboard/useDashboardNavigation.ts
"use client";
import { useNavigation } from "@/lib/useNavigation";
import { DASHBOARD_ROUTES } from "@/config/routes";

export const useDashboardNavigation = () => useNavigation(DASHBOARD_ROUTES);