// src/lib/useAppNavigation.ts
"use client";
import { useMemo, useState, useCallback } from "react";
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
        if (!route) throw new Error(`Invalid route key: ${String(key)}`);
        return route;
      } catch (error) {
        onError?.(error as Error);
        return routes[Object.keys(routes)[0] as RouteKey<T>];
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

  console.log(`[Navigation] ${from} → ${to}`);

  const gtagWindow = window as GtagWindow;
  if (gtagWindow.gtag) {
    gtagWindow.gtag("event", "page_view", {
      page_path: to,
      page_referrer: from,
    });
  }
};

export const useAuthenticatedNavigation = () => {
  const [isChecking, setIsChecking] = useState(false);
  const { dashboard, auth } = useAppNavigation();

  const checkAuthAndNavigate = useCallback(async (
    targetRoute: keyof typeof DASHBOARD_ROUTES
  ) => {
    setIsChecking(true);
    
    try {
      // Check for token (adjust based on your auth implementation)
      const token = localStorage.getItem("auth_token") || 
                    sessionStorage.getItem("auth_token") ||
                    document.cookie.split('; ').find(row => row.startsWith('token='));

      // Simulate async check if needed (e.g., token validation)
      await new Promise(resolve => setTimeout(resolve, 300));

      if (token) {
        // Token exists, navigate to dashboard
        dashboard.goTo(targetRoute);
      } else {
        // No token, navigate to login
        auth.goTo("login");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // On error, redirect to login for safety
      auth.goTo("login");
    } finally {
      setIsChecking(false);
    }
  }, [dashboard, auth]);

  return {
    isChecking,
    navigateWithAuth: checkAuthAndNavigate
  };
};