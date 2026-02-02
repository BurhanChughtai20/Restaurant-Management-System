"use client";

import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import Link from "next/link";

import { ButtonWithIcon } from "./Button";
import { getToken } from "@/lib/tokenStore";
import { AUTH_ROUTES, DASHBOARD_ROUTES } from "@/config/routes";
import { SafeSidebarTrigger } from "./SafeSidebarTrigger";

const styles = {
  container: `
    fixed top-0 z-50 w-full
    border-b bg-background/80 backdrop-blur
  `,
  inner: `
    mx-auto flex h-14 max-w-7xl items-center
    px-4 sm:px-6
  `,
  logo: `
    text-lg font-semibold tracking-tight
  `,
  spacer: `flex-1`,
  buttonWrap: `
    hidden sm:flex
  `,
  mobileIcon: `
    sm:hidden inline-flex items-center justify-center
    rounded-md p-2 transition
    hover:bg-muted
  `,
} as const;

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const token = getToken();

  const isDashboard = useMemo(
    () => pathname.startsWith(DASHBOARD_ROUTES.dashboard),
    [pathname]
  );

  const handleDashboardNavigation = () => {
    router.push(token ? DASHBOARD_ROUTES.dashboard : AUTH_ROUTES.login);
  };

  return (
    <header className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <Link href="/">
            <span className="text-primary">Restaurant</span>Hub
          </Link>
        </div>

        <div className={styles.spacer} />

        {!isDashboard && (
          <div className={styles.buttonWrap}>
            <ButtonWithIcon
              icon={<LogIn size={16} />}
              text="Get Started"
              size="sm"
              variant="outline"
              onClick={handleDashboardNavigation}
            />
          </div>
        )}

        {isDashboard ? (
  <div className={styles.mobileIcon}>
    <SafeSidebarTrigger /> 
  </div>
)  : (
          <div className="sm:hidden">
            <ButtonWithIcon
              text="Start"
              size="sm"
              variant="default"
              icon={<LogIn size={16} />}
              onClick={handleDashboardNavigation}
            />
          </div>
        )}
      </div>
    </header>
  );
};
