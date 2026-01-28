"use client";

import React, { useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import ButtonCom from "./Button";
import { useAuthenticatedNavigation } from "@/lib/useAppNavigation";
import { useAppDispatch } from "@/app/store/hooks";
import { logout, deleteAccountSuccess } from "@/app/store/slices/authSlice";
import { MAIN_MENU_ITEMS, SECONDARY_MENU_ITEMS } from "@/config/menuConfig";
import { DASHBOARD_ROUTES, type DashboardRouteKey } from "@/config/routes";
import { NavMenuItem } from "./admin-dashboard/types";

const CLASSES = {
  container: "relative w-full",
  containerDashboard: "relative w-full lg:hidden",
  navBodyWithButton: "flex items-center gap-4",
  leftSection: "flex items-center gap-4",
  rightSection: "flex items-center gap-4 ml-auto",
  mobileMenuContent: "flex flex-col gap-4 py-4",
} as const;

// O(1) reverse route lookup: route string -> DashboardRouteKey
const createRouteKeyMap = (): Map<string, DashboardRouteKey> => {
  const map = new Map<string, DashboardRouteKey>();
  (Object.entries(DASHBOARD_ROUTES) as [DashboardRouteKey, string][]).forEach(
    ([key, route]) => {
      map.set(route, key);
    }
  );
  return map;
};

const ROUTE_KEY_MAP = createRouteKeyMap();

// Special routes that require confirmation
const SPECIAL_ROUTES = {
  deleteAccount: "/dashboard/delete-account",
} as const;

export const DashboardNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { navigateWithAuth } = useAuthenticatedNavigation();

  const isDashboard = useMemo(() => pathname?.startsWith("/dashboard"), [pathname]);
  const containerClass = isDashboard ? CLASSES.containerDashboard : CLASSES.container;

  const dashboardNavItems = useMemo(
    () => [...MAIN_MENU_ITEMS, ...SECONDARY_MENU_ITEMS],
    []
  );

  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const getRouteKey = useCallback((route: string): DashboardRouteKey | null => {
    return ROUTE_KEY_MAP.get(route) ?? null;
  }, []);

  const handleSpecialRoute = useCallback(
    (route: string) => {
      if (route === SPECIAL_ROUTES.deleteAccount) {
        if (window.confirm("Are you sure you want to delete your account?")) {
          dispatch(deleteAccountSuccess());
        }
        return true;
      }
      return false;
    },
    [dispatch]
  );

  const handleNavClick = useCallback(
    (item: NavMenuItem) => {
      if (handleSpecialRoute(item.route)) {
        closeMenu();
        return;
      }

      // O(1) route key lookup
      const routeKey = getRouteKey(item.route);

      if (routeKey) {
        navigateWithAuth(routeKey);
      } else {
        console.warn(`Unknown dashboard route: ${item.route}`);
      }
      closeMenu();
    },
    [getRouteKey, handleSpecialRoute, navigateWithAuth, closeMenu]
  );

  const handleLogoutClick = useCallback(() => {
    dispatch(logout());
    closeMenu();
  }, [dispatch, closeMenu]);

  const handleGetStartedClick = useCallback(() => {
    navigateWithAuth("dashboard");
  }, [navigateWithAuth]);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className={containerClass}>
      <Navbar>
        {!isDashboard && (
          <NavBody className={CLASSES.navBodyWithButton}>
            <div className={CLASSES.leftSection}>
              <NavbarLogo />
            </div>
            <div className={CLASSES.rightSection}>
              <ButtonCom
                text="Get Started Today!"
                type="default"
                gradient
                icon={<LogIn size={18} />}
                iconPosition="right"
                onClick={handleGetStartedClick}
                className="w-full bg-white! text-black"
              />
            </div>
          </NavBody>
        )}

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            {isDashboard && (
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((p) => !p)}
              />
            )}
          </MobileNavHeader>

          {isDashboard && (
            <MobileNavMenu isOpen={isMobileMenuOpen} onClose={closeMenu}>
              <div className={CLASSES.mobileMenuContent}>
                {dashboardNavItems.map((item) => (
                  <ButtonCom
                    key={item.id}
                    text={item.label}
                    type="default"
                    gradient
                    icon={item.icon}
                    iconPosition="left"
                    onClick={() => handleNavClick(item)}
                    className="w-full text-left"
                  />
                ))}

                <ButtonCom
                  text="Logout"
                  type="default"
                  gradient
                  icon={<LogIn size={18} />}
                  iconPosition="left"
                  onClick={handleLogoutClick}
                  className="w-full text-left"
                />
              </div>
            </MobileNavMenu>
          )}
        </MobileNav>
      </Navbar>
    </div>
  );
};
