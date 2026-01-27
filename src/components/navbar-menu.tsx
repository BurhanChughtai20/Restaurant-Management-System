"use client";

import { memo, useCallback, useMemo, useState } from "react";
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
import type { NavMenuItem } from "@/app/store/api";

const CLASSES = {
  container: "relative w-full",
  containerDashboard: "relative w-full lg:hidden",
  navBodyWithButton: "flex items-center gap-4",
  leftSection: "flex items-center gap-4",
  rightSection: "flex items-center gap-4 ml-auto",
  mobileMenuContent: "flex flex-col gap-4 py-4",
} as const;

export const DashboardNavbar = memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { navigateWithAuth } = useAuthenticatedNavigation();

  // Helper to check dashboard context
  const isDashboard = useMemo(() => pathname?.startsWith("/dashboard"), [pathname]);

  const containerClass = isDashboard ? CLASSES.containerDashboard : CLASSES.container;

  const dashboardNavItems: NavMenuItem[] = useMemo(
    () => [...MAIN_MENU_ITEMS, ...SECONDARY_MENU_ITEMS],
    []
  );

  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const handleNavClick = useCallback(
    (route: DashboardRouteKey | "delete_account") => {
      if (route === "delete_account") {
        if (window.confirm("Are you sure you want to delete your account?")) {
          dispatch(deleteAccountSuccess());
        }
      } else {
        navigateWithAuth(route); 
      }
      closeMenu();
    },
    [dispatch, navigateWithAuth, closeMenu]
  );

  const handleLogoutClick = useCallback(() => {
    dispatch(logout());
    closeMenu();
  }, [dispatch, closeMenu]);

  const handleGetStartedClick = useCallback(() => {
    navigateWithAuth("dashboard");
  }, [navigateWithAuth]);

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
                {dashboardNavItems.map(({ id, label, icon, route }) => (
                  <ButtonCom
                    key={id}
                    text={label}
                    type="default"
                    gradient
                    icon={icon}
                    iconPosition="left"
                    onClick={() => handleNavClick(route)}
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
});

DashboardNavbar.displayName = "DashboardNavbar";