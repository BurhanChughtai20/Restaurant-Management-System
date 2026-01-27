"use client";

import { useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES, DASHBOARD_ROUTES, APP_ROUTES } from "@/config/routes";
import { selectToken } from "@/app/store/slices/authSlice";

// Type-safe map for O(1) lookup
type RouteMap = Record<string, string>;

export const createSafeNavigator = <T extends RouteMap>(
  routes: T,
  onError?: (error: Error) => void,
) => {
  // Precompute route set for fast O(1) existence check
  const routeSet = new Set(Object.values(routes));

  return {
    goTo: (key: keyof T) => {
      const route = routes[key];
      if (!route) {
        const error = new Error(`Invalid route key: ${String(key)}`);
        onError?.(error);
        return routes[Object.keys(routes)[0] as keyof T]; // fallback
      }
      return route;
    },
    goToPath: (path: string) => {
      if (typeof window === "undefined") return;
      window.history.pushState({}, "", path);
      window.dispatchEvent(new Event("popstate")); // SPA-friendly
    },
    isActive: (key: keyof T, currentPath: string) =>
      typeof routes[key] === "string" && currentPath.startsWith(routes[key]),
    getAllRoutes: () => Object.values(routes),
    hasRoute: (key: keyof T | string) => {
      // O(1) existence check using precomputed Set
      const route = routes[key as keyof T];
      return route ? routeSet.has(route) : false;
    },
  };
};

// Global navigators
export const useAppNavigation = () =>
  useMemo(
    () => ({
      auth: createSafeNavigator(AUTH_ROUTES),
      dashboard: createSafeNavigator(DASHBOARD_ROUTES),
      app: createSafeNavigator(APP_ROUTES),
    }),
    [],
  );

// Auth-aware navigation
export const useAuthenticatedNavigation = () => {
  const token = useSelector(selectToken);
  const router = useRouter();

  const navigateWithAuth = useCallback(
    (target: keyof typeof DASHBOARD_ROUTES) => {
      const path = DASHBOARD_ROUTES[target];
      if (!path) {
        console.warn(`[Navigation] Invalid dashboard route: ${String(target)}`);
        return;
      }

      if (token) router.push(path);
      else router.push(AUTH_ROUTES.login);
    },
    [router, token],
  );

  return { navigateWithAuth };
};

export const isValidRoute = <T extends Record<string, string>>(
  route: string,
  routes: T,
) => {
  const routeSet = new Set(Object.values(routes));
  return routeSet.has(route);
};

// Simple SPA navigation hooks
export const useNavigation = <T extends RouteMap>(routes: T) => {
  const router = useRouter();

  const goTo = (key: keyof T) => {
    const path = routes[key];
    if (typeof path !== "string") {
      console.error(`[Navigation] Invalid key: ${String(key)}`);
      return;
    }
    router.push(path);
  };

  const replaceWith = (key: keyof T) => {
    const path = routes[key];
    if (typeof path !== "string") {
      console.warn(`[Navigation] Invalid key for replace: ${String(key)}`);
      return;
    }
    router.replace(path);
  };

  return { goTo, replaceWith };
};

// Prefetch static routes for performance
export const prefetchRoutes = (routes: string[]) => {
  if (typeof window === "undefined") return;
  routes.forEach((route) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = route;
    document.head.appendChild(link);
  });
};

// Google Analytics tracking
interface GtagWindow extends Window {
  gtag?: (
    command: string,
    eventName: string,
    params: Record<string, string>,
  ) => void;
}
export const trackNavigation = (from: string, to: string) => {
  console.log(`[Navigation] ${from} → ${to}`);
  const win = window as GtagWindow;
  if (win.gtag)
    win.gtag("event", "page_view", { page_path: to, page_referrer: from });
};
