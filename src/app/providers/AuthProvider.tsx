"use client";

import React, { useEffect, useState, useTransition, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { restoreAuth, selectIsAuthenticated } from "@/app/store/slices/authSlice";
import { AUTH_ROUTES, DASHBOARD_ROUTES } from "@/config/routes";

type AuthRouteValue = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
const AUTH_ROUTES_SET: Set<AuthRouteValue> = new Set(Object.values(AUTH_ROUTES));

const isAuthRoute = (pathname: string): pathname is AuthRouteValue => {
  return AUTH_ROUTES_SET.has(pathname as AuthRouteValue);
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [isHydrated, setIsHydrated] = useState(false);
  const [, startTransition] = useTransition();

  const routeCheckResults = useMemo(() => {
    if (!pathname) return { isAuthPath: false, isDashboardPath: false };
    
    return {
      isAuthPath: isAuthRoute(pathname),
      isDashboardPath: pathname.startsWith(DASHBOARD_ROUTES.dashboard),
    };
  }, [pathname]);

  useEffect(() => {
  dispatch(restoreAuth());
  startTransition(() => setIsHydrated(true));
}, [dispatch]);

  useEffect(() => {
    if (!isHydrated || !pathname) return;

    const { isAuthPath, isDashboardPath } = routeCheckResults;

    if (isAuthenticated && isAuthPath) {
      router.replace(DASHBOARD_ROUTES.dashboard);
    } else if (!isAuthenticated && isDashboardPath) {
      router.replace(AUTH_ROUTES.login);
    }
  }, [isAuthenticated, pathname, router, isHydrated, routeCheckResults]);

  if (!isHydrated) return null;

  return <>{children}</>;
}