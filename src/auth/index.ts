// src/auth/index.ts
"use client";

import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "./routes";

export const useAuthNavigation = () => {
  const router = useRouter();

  return {
    goToLogin: () => router.push(AUTH_ROUTES.login),
    goToSignup: () => router.push(AUTH_ROUTES.signup),
    goToForgotPassword: () => router.push(AUTH_ROUTES.forgotPassword),
    goToResetPassword: () => router.push(AUTH_ROUTES.resetPassword),
    goToVerifyEmail: () => router.push(AUTH_ROUTES.verifyEmail),

    // Generic navigation by route key
    goTo: (route: keyof typeof AUTH_ROUTES) => {
      router.push(AUTH_ROUTES[route]);
    },

    // Replace navigation
    replaceWith: (route: keyof typeof AUTH_ROUTES) => {
      router.replace(AUTH_ROUTES[route]);
    }
  };
};
