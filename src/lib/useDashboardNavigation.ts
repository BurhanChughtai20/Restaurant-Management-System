"use client";
import { useRouter } from "next/navigation";
import { DASHBOARD_ROUTES, DashboardRouteKey } from "../config/menuConfig";

export const useDashboardNavigation = () => {
  const router = useRouter();

  const goTo = (route: DashboardRouteKey) => {
    const path = DASHBOARD_ROUTES[route];
    if (!path)
      return console.warn(
        `[Navigation Warning] Route "${route}" does not exist.`,
      );
    router.push(path);
  };

  const replaceWith = (route: DashboardRouteKey) => {
    const path = DASHBOARD_ROUTES[route];
    if (!path)
      return console.warn(
        `[Navigation Warning] Route "${route}" does not exist.`,
      );
    router.replace(path);
  };

  return { goTo, replaceWith };
};
