"use client";
import { useRouter } from "next/navigation";
import { DASHBOARD_ROUTES, AUTH_ROUTES } from "@/config/routes";
import { hasToken } from "@/lib/tokenStore";

export const useAuthNavigation = () => {
  const router = useRouter();

  const goToDashboard = () => {
    if (hasToken()) router.push(DASHBOARD_ROUTES.dashboard);
    else router.push(AUTH_ROUTES.login);
  };

  return { goToDashboard };
};
