"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  ChefHat,
  FileText,
  MessageSquare,
  User,
  Settings,
  Trash2,
  LogIn,
  LucideIcon,
} from "lucide-react";

import { useAuthenticatedNavigation } from "@/lib/useAppNavigation";
import { DASHBOARD_ROUTES } from "@/config/routes";
import ButtonCom from "./Button";
import { useAppDispatch } from "@/app/store/hooks";
import { logout, deleteAccountSuccess } from "@/app/store/slices/authSlice";

const classes = {
  container: "relative w-full",
  containerDashboard: "relative w-full lg:hidden",
  navBodyWithButton: "flex items-center gap-4",
  leftSection: "flex items-center gap-4",
  rightSection: "flex items-center gap-4 ml-auto",
  mobileMenuContent: "flex flex-col gap-4 py-4",
  loadingOverlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
};

type NavItemRouteKey = keyof typeof DASHBOARD_ROUTES | "delete_account";

interface NavItem {
  name: string;
  routeKey: NavItemRouteKey;
  icon: LucideIcon;
}

export const DashboardNavbar = memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { navigateWithAuth } = useAuthenticatedNavigation();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const isDashboardRoute = useMemo(
    () => pathname.startsWith("/dashboard"),
    [pathname]
  );

  const dashboardNavItems: NavItem[] = useMemo(
    () => [
      { name: "Dashboard", routeKey: "dashboard", icon: LayoutDashboard },
      { name: "Menu Items", routeKey: "MenuItem", icon: UtensilsCrossed },
      { name: "Order Taker", routeKey: "Order_Taker", icon: ClipboardList },
      { name: "Chef", routeKey: "Chef", icon: ChefHat },
      { name: "Articles", routeKey: "Article", icon: FileText },
      { name: "WhatsApp Bot", routeKey: "whatsapp_bot", icon: MessageSquare },
      { name: "Profile", routeKey: "profile", icon: User },
      { name: "Settings", routeKey: "settings", icon: Settings },
      { name: "Delete Account", routeKey: "delete_account", icon: Trash2 },
    ],
    []
  );

  const handleNavClick = useCallback(
    (routeKey: NavItemRouteKey) => {
      if (routeKey === "delete_account") {
        const confirmed = window.confirm(
          "Are you sure you want to delete your account? This action cannot be undone."
        );
        if (confirmed) dispatch(deleteAccountSuccess());
        return;
      }

      navigateWithAuth(routeKey);
      setIsMobileMenuOpen(false);
    },
    [navigateWithAuth, dispatch]
  );

  const handleLogoutClick = useCallback(() => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
  }, [dispatch]);

  const handleGetStartedClick = useCallback(
    () => navigateWithAuth("dashboard"),
    [navigateWithAuth]
  );

  return (
    <>
      <div
        className={
          isDashboardRoute
            ? classes.containerDashboard
            : classes.container
        }
      >
        <Navbar>
          {!isDashboardRoute && (
            <NavBody className={classes.navBodyWithButton}>
              <div className={classes.leftSection}>
                <NavbarLogo />
              </div>

              <div className={classes.rightSection}>
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
              {isDashboardRoute && (
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen((p) => !p)}
                />
              )}
            </MobileNavHeader>

            {isDashboardRoute && (
              <MobileNavMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
              >
                <div className={classes.mobileMenuContent}>
                  {dashboardNavItems.map(({ name, routeKey, icon: Icon }) => (
                    <ButtonCom
                      key={routeKey}
                      text={name}
                      type="default"
                      gradient
                      icon={<Icon size={18} />}
                      iconPosition="left"
                      onClick={() => handleNavClick(routeKey)}
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
    </>
  );
});

DashboardNavbar.displayName = "DashboardNavbar";
