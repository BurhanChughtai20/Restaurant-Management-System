"use client";

import { useState, memo, useCallback, useMemo } from "react";
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
  HelpCircle,
  LogIn,
} from "lucide-react";
import { useAuthenticatedNavigation } from "@/lib/useAppNavigation";
import { DASHBOARD_ROUTES } from "@/config/routes";
import ButtonCom from "./Button"; 
import Loading from "@/app/loading";

const classes = {
  container: "relative w-full",
  containerDashboard: "relative w-full lg:hidden",
  navBodyWithButton: "flex items-center gap-4",
  leftSection: "flex items-center gap-4",
  rightSection: "flex items-center gap-4 ml-auto",
  mobileMenuContent: "flex flex-col gap-6 py-4",
  mobileLink:
    "flex items-center gap-3 text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 transition-colors font-medium text-lg",
  mobileLinkIcon: "text-black",
  mobileLinkText: "text-gray-800 text-sm",
  mobileButton: "mt-4",
  mobileButtonWrapper: "px-4 py-2",
  desktopButton: "flex",
  loadingOverlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
};

const dashboardNavItems = [
  {
    name: "Dashboard",
    routeKey: "dashboard" as const,
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: "Menu Items",
    routeKey: "MenuItem" as const,
    icon: <UtensilsCrossed size={18} />,
  },
  {
    name: "Order Taker",
    routeKey: "Order_Taker" as const,
    icon: <ClipboardList size={18} />,
  },
  { name: "Chef", routeKey: "Chef" as const, icon: <ChefHat size={18} /> },
  {
    name: "Articles",
    routeKey: "Article" as const,
    icon: <FileText size={18} />,
  },
  {
    name: "WhatsApp Bot",
    routeKey: "whatsapp_bot" as const,
    icon: <MessageSquare size={18} />,
  },
  { name: "Profile", routeKey: "profile" as const, icon: <User size={18} /> },
  {
    name: "Settings",
    routeKey: "settings" as const,
    icon: <Settings size={18} />,
  },
  { name: "Help", routeKey: "help" as const, icon: <HelpCircle size={18} /> },
];

export const DashboardNavbar = memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isChecking, navigateWithAuth } = useAuthenticatedNavigation();
  const pathname = usePathname();

  const isDashboardRoute = useMemo(
    () => pathname.startsWith("/dashboard"),
    [pathname],
  );

  const handleNavClick = useCallback(
    (routeKey: keyof typeof DASHBOARD_ROUTES) => {
      navigateWithAuth(routeKey);
      setIsMobileMenuOpen(false);
    },
    [navigateWithAuth],
  );

  const handleGetStartedClick = useCallback(() => {
    console.log("Get started clicked");
    navigateWithAuth("dashboard");
  }, [navigateWithAuth]);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* Loading Overlay */}
      {isChecking && (
        <div className={classes.loadingOverlay}>
          <Loading />
        </div>
      )}

      <div
        className={
          isDashboardRoute ? classes.containerDashboard : classes.container
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
                  gradient={true}
                  icon={<LogIn size={18} />}
                  iconPosition="right"
                  onClick={handleGetStartedClick}
                  className="w-full bg-white! text-black"
                  disabled={isChecking}
                />
              </div>
            </NavBody>
          )}

          {/* Mobile Navigation */}
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              {isDashboardRoute && (
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={handleMobileMenuToggle}
                />
              )}
            </MobileNavHeader>

            {isDashboardRoute ? (
              <MobileNavMenu
                isOpen={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
              >
                <div className={classes.mobileMenuContent}>
                  {dashboardNavItems.map((item, idx) => (
                    <button
                      key={`mobile-link-${idx}`}
                      onClick={() => handleNavClick(item.routeKey)}
                      className={classes.mobileLink}
                      disabled={isChecking}
                    >
                      <span className={classes.mobileLinkIcon}>{item.icon}</span>
                      <span className={classes.mobileLinkText}>{item.name}</span>
                    </button>
                  ))}
                </div>
              </MobileNavMenu>
            ) : (
              <div className={classes.mobileButtonWrapper}>
                <ButtonCom
                  text="Get Started Today!"
                  type="default"
                  gradient={true}
                  icon={<LogIn size={18} />}
                  iconPosition="right"
                  onClick={handleGetStartedClick}
                  className="w-full bg-white! text-black"
                  disabled={isChecking}
                />
              </div>
            )}
          </MobileNav>
        </Navbar>
      </div>
    </>
  );
});

DashboardNavbar.displayName = "DashboardNavbar";