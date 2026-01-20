// src/auth/index.ts
"use client";

import { useRouter } from "next/navigation";
import { AUTH_ROUTES, DASHBOARD_ROUTES } from "@/config/routes";

export const useAuthNavigation = () => {
  const router = useRouter();

  return {
    // Auth routes
    goToLogin: () => router.push(AUTH_ROUTES.login),
    goToSignup: () => router.push(AUTH_ROUTES.signup),
    goToForgotPassword: () => router.push(AUTH_ROUTES.forgotPassword),
    goToResetPassword: () => router.push(AUTH_ROUTES.resetPassword),
    goToVerifyEmail: () => router.push(AUTH_ROUTES.verifyEmail),

    // Dashboard routes
    goToDashboard: () => router.push(DASHBOARD_ROUTES.dashboard),

    // Generic navigation
    goTo: (route: keyof typeof AUTH_ROUTES) => router.push(AUTH_ROUTES[route]),
    replaceWith: (route: keyof typeof AUTH_ROUTES) => router.replace(AUTH_ROUTES[route]),
  };
};
