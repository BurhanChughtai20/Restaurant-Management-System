// src/lib/useAppNavigation.ts
"use client";
import { useMemo } from "react";
import { useNavigation } from "./useNavigation";
import { AUTH_ROUTES, DASHBOARD_ROUTES, APP_ROUTES } from "@/config/routes";

export const useAppNavigation = () => {
  const authNavigation = useNavigation(AUTH_ROUTES);
  const dashboardNavigation = useNavigation(DASHBOARD_ROUTES);
  const appNavigation = useNavigation(APP_ROUTES);

  return useMemo(
    () => ({
      auth: authNavigation,
      dashboard: dashboardNavigation,
      app: appNavigation,
    }),
    [authNavigation, dashboardNavigation, appNavigation]
  );
};

const routeCache = new Map<string, boolean>();

export const isValidRoute = (
  route: string,
  routeConfig: Record<string, string>
): boolean => {
  const cacheKey = `${route}:${Object.keys(routeConfig).join(",")}`;
  
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }

  const isValid = Object.values(routeConfig).some((validRoute) =>
    route.startsWith(validRoute)
  );

  routeCache.set(cacheKey, isValid);
  return isValid;
};

export type RouteKey<T extends Record<string, string>> = keyof T;

export const createSafeNavigator = <T extends Record<string, string>>(
  routes: T,
  onError?: (error: Error) => void
) => {
  return {
    goTo: (key: RouteKey<T>) => {
      try {
        const route = routes[key];
        if (!route) {
          throw new Error(`Invalid route key: ${String(key)}`);
        }
        return route;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        onError?.(err);
        console.error("[Navigation Error]:", err.message);
        return routes[Object.keys(routes)[0] as RouteKey<T>]; // Fallback to first route
      }
    },
    isActive: (key: RouteKey<T>, currentPath: string) => {
      return currentPath.startsWith(routes[key]);
    },
    getAllRoutes: () => Object.values(routes),
  };
};
export const useNavigationHistory = (maxHistory: number = 10) => {
  const [history, setHistory] = useMemo(() => {
    if (typeof window === "undefined") return [[], () => {}];
    
    const stored = sessionStorage.getItem("nav_history");
    const initial = stored ? JSON.parse(stored) : [];
    
    return [
      initial,
      (newPath: string) => {
        const updated = [newPath, ...initial].slice(0, maxHistory);
        sessionStorage.setItem("nav_history", JSON.stringify(updated));
        return updated;
      },
    ] as const;
  }, [maxHistory]);

  return {
    history,
    addToHistory: (path: string) => setHistory(path),
    clearHistory: () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("nav_history");
      }
    },
  };
};
export const prefetchRoutes = (routes: string[]) => {
  if (typeof window === "undefined") return;

  routes.forEach((route) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = route;
    document.head.appendChild(link);
  });
};

interface GtagWindow extends Window {
  gtag?: (
    command: string,
    eventName: string,
    params: Record<string, string>
  ) => void;
}

export const trackNavigation = (from: string, to: string) => {
  if (typeof window === "undefined") return;

  // Log navigation event
  console.log(`[Navigation] ${from} → ${to}`);

  // You can integrate with analytics services here
  const gtagWindow = window as GtagWindow;
  if (gtagWindow.gtag) {
    gtagWindow.gtag("event", "page_view", {
      page_path: to,
      page_referrer: from,
    });
  }
};