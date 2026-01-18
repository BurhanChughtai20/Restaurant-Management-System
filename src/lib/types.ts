import { DASHBOARD_ROUTES } from "../config/menuConfig";

export type DashboardRouteKey = keyof typeof DASHBOARD_ROUTES;
export type DashboardRouteValue = (typeof DASHBOARD_ROUTES)[DashboardRouteKey];
