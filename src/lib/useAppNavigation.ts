// src/lib/useAppNavigation.ts
"use client";

import { useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { AUTH_ROUTES, DASHBOARD_ROUTES, APP_ROUTES } from "@/config/routes";
import { selectToken } from "@/app/store/slices/authSlice";
import { useRouter } from "next/navigation";

// Type-safe RouteKey
export type RouteKey<T extends Record<string, string>> = keyof T;

export const createSafeNavigator = <T extends Record<string, string>>(routes: T, onError?: (error: Error) => void) => {
  return {
    goTo: (key: keyof T) => {
      try {
        const route = routes[key];
        if (!route) throw new Error(`Invalid route key: ${String(key)}`);
        return route;
      } catch (error) {
        onError?.(error as Error);
        return routes[Object.keys(routes)[0] as keyof T];
      }
    },
    goToPath: (path: string) => {
      if (typeof window !== "undefined") {
        window.history.pushState({}, "", path); // SPA-friendly
        // optional: dispatch navigation event for analytics / hooks
        window.dispatchEvent(new Event("popstate"));
      }
    },
    isActive: (key: keyof T, currentPath: string) => currentPath.startsWith(routes[key]),
    getAllRoutes: () => Object.values(routes),
    hasRoute: (key: keyof T) => Boolean(routes[key]),
  };
};

export const useAppNavigation = () => {
  return useMemo(() => ({
    auth: createSafeNavigator(AUTH_ROUTES),
    dashboard: createSafeNavigator(DASHBOARD_ROUTES),
    app: createSafeNavigator(APP_ROUTES),
  }), []);
};

export const useAuthenticatedNavigation = () => {
  const token = useSelector(selectToken);
  const router = useRouter();

  const navigateWithAuth = useCallback(
    (target: keyof typeof DASHBOARD_ROUTES) => {
      if (token) {
        router.push(DASHBOARD_ROUTES[target]);
      } else {
        router.push(AUTH_ROUTES.login);
      }
    },
    [router, token]
  );

  return { navigateWithAuth };
};
// Route validation (O(1) using Map)
export const isValidRoute = <T extends Record<string, string>>(route: string, routes: T) => {
  const routeMap = new Map(Object.values(routes).map(r => [r, true]));
  return routeMap.has(route);
};

// Navigation history (maxHistory default = 10)
export const useNavigationHistory = (maxHistory: number = 10) => {
  const historyKey = "nav_history";

  const getHistory = () => {
    if (typeof window === "undefined") return [] as string[];
    const stored = sessionStorage.getItem(historyKey);
    return stored ? JSON.parse(stored) as string[] : [];
  };

  const addToHistory = (path: string) => {
    const hist = getHistory();
    const updated = [path, ...hist.filter(p => p !== path)].slice(0, maxHistory);
    sessionStorage.setItem(historyKey, JSON.stringify(updated));
    return updated;
  };

  const clearHistory = () => {
    if (typeof window !== "undefined") sessionStorage.removeItem(historyKey);
  };

  return { history: getHistory(), addToHistory, clearHistory };
};

// Prefetch static routes for performance
export const prefetchRoutes = (routes: string[]) => {
  if (typeof window === "undefined") return;
  routes.forEach(route => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = route;
    document.head.appendChild(link);
  });
};

// Google Analytics / GTAG navigation tracking
interface GtagWindow extends Window {
  gtag?: (command: string, eventName: string, params: Record<string, string>) => void;
}
export const trackNavigation = (from: string, to: string) => {
  console.log(`[Navigation] ${from} → ${to}`);
  const win = window as GtagWindow;
  if (win.gtag) win.gtag("event", "page_view", { page_path: to, page_referrer: from });
};
