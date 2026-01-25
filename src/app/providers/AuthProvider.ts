"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { restoreAuth, selectIsAuthenticated } from "@/app/store/slices/authSlice";

const AUTH_ROUTES: readonly string[] = [
  "/signup",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

function isAuthRoute(path: string): boolean {
  return AUTH_ROUTES.some((route) => path.startsWith(route));
}

function isDashboardRoute(path: string): boolean {
  return path.startsWith("/dashboard");
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactNode {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!pathname) return;

    if (isAuthenticated && isAuthRoute(pathname)) {
      router.replace("/dashboard");
    }

    if (!isAuthenticated && isDashboardRoute(pathname)) {
      router.replace("/login");
    }
  }, [isAuthenticated, pathname, router]);

  return children;
}