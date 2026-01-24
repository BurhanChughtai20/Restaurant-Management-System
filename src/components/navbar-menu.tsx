"use client";

import React, { useState, memo, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavBody,
  NavItems,
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
  LogIn
} from "lucide-react";
import { useAppNavigation } from "@/lib/useAppNavigation";
import { DASHBOARD_ROUTES } from "@/config/routes";
import ButtonCom from "./Button";

const classes = {
  container: "relative w-full",
  navBodyWithButton: "flex items-center gap-4",
  leftSection: "flex items-center gap-4",
  rightSection: "flex items-center gap-4 ml-auto",
  mobileMenuContent: "flex flex-col gap-6 py-4",
  mobileLink: "flex items-center gap-3 text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 transition-colors font-medium text-lg",
  mobileLinkIcon: "text-black",
  mobileLinkText: "text-gray-800 text-sm",
  mobileButton: "mt-4",
  mobileButtonWrapper: "md:hidden px-4 py-2",
  desktopButton: "hidden md:flex",
};

// Dashboard nav items using DASHBOARD_ROUTES
const dashboardNavItems = [
  { name: "Dashboard", routeKey: "dashboard" as const, icon: <LayoutDashboard size={18} /> },
  { name: "Menu Items", routeKey: "MenuItem" as const, icon: <UtensilsCrossed size={18} /> },
  { name: "Order Taker", routeKey: "Order_Taker" as const, icon: <ClipboardList size={18} /> },
  { name: "Chef", routeKey: "Chef" as const, icon: <ChefHat size={18} /> },
  { name: "Articles", routeKey: "Article" as const, icon: <FileText size={18} /> },
  { name: "WhatsApp Bot", routeKey: "whatsapp_bot" as const, icon: <MessageSquare size={18} /> },
  { name: "Profile", routeKey: "profile" as const, icon: <User size={18} /> },
  { name: "Settings", routeKey: "settings" as const, icon: <Settings size={18} /> },
  { name: "Help", routeKey: "help" as const, icon: <HelpCircle size={18} /> },
];

export const DashboardNavbar = memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { dashboard } = useAppNavigation();
  const pathname = usePathname();

  // Check if current route is a dashboard route - more precise check
  const isDashboardRoute = useMemo(
    () => pathname.startsWith('/dashboard'),
    [pathname]
  );

  // Memoize nav items mapping
  const navItems = useMemo(
    () => dashboardNavItems.map((item) => ({
      name: item.name,
      link: DASHBOARD_ROUTES[item.routeKey],
      icon: item.icon,
    })),
    []
  );

  // Memoized callbacks
  const handleNavClick = useCallback((routeKey: keyof typeof DASHBOARD_ROUTES) => {
    dashboard.goTo(routeKey);
    setIsMobileMenuOpen(false);
  }, [dashboard]);

  const handleGetStartedClick = useCallback(() => {
    console.log('Get started clicked');
    dashboard.goTo("dashboard");
  }, [dashboard]);

  const handleDashboardClick = useCallback(() => {
    console.log('Dashboard clicked');
    dashboard.goTo("dashboard");
  }, [dashboard]);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleMobileDashboardClick = useCallback(() => {
    console.log('Mobile dashboard clicked');
    dashboard.goTo("dashboard");
    setIsMobileMenuOpen(false);
  }, [dashboard]);

  // Memoized button components
  const DesktopGetStartedButton = useMemo(
    () => (
      <ButtonCom
        text="Get Started Today!"
        type="default"
        gradient={true}
        icon={<LogIn size={18} />}
        iconPosition="right"
        onClick={handleGetStartedClick}
        className={classes.desktopButton}
      />
    ),
    [handleGetStartedClick]
  );

  const DesktopDashboardButton = useMemo(
    () => (
      <ButtonCom
        text="Dashboard"
        type="primary"
        icon={<LayoutDashboard size={18} />}
        onClick={handleDashboardClick}
        className={classes.desktopButton}
      />
    ),
    [handleDashboardClick]
  );

  return (
    <div className={classes.container}>
      <Navbar>
        <NavBody className={classes.navBodyWithButton}>
          <div className={classes.leftSection}>
            <NavbarLogo />

            {/* Desktop navigation items - Never show on mobile/tablet */}
            {isDashboardRoute && <NavItems items={navItems} />}
          </div>

          {/* Right side button - Always visible on desktop */}
          <div className={classes.rightSection}>
            {!isDashboardRoute ? DesktopGetStartedButton : DesktopDashboardButton}
          </div>
        </NavBody>

        {/* Mobile Navigation - Only for xs, sm, md screens */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            {/* Only show toggle button if on a dashboard route */}
            {isDashboardRoute && (
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={handleMobileMenuToggle}
              />
            )}
          </MobileNavHeader>

          {/* Mobile menu - Only show nav items on dashboard routes */}
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
                  >
                    <span className={classes.mobileLinkIcon}>{item.icon}</span>
                    <span className={classes.mobileLinkText}>{item.name}</span>
                  </button>
                ))}

                {/* Mobile dashboard button at the bottom of menu */}
                <div className={classes.mobileButton}>
                  <ButtonCom
                    text="Dashboard"
                    type="primary"
                    icon={<LayoutDashboard size={18} />}
                    onClick={handleMobileDashboardClick}
                    className="w-full"
                  />
                </div>
              </div>
            </MobileNavMenu>
          ) : (
            /* Show "Get Started" button on non-dashboard routes for mobile */
            <div className={classes.mobileButtonWrapper}>
              <ButtonCom
                text="Get Started Today!"
                type="default"
                gradient={true}
                icon={<LogIn size={18} />}
                iconPosition="right"
                onClick={handleGetStartedClick}
                className="w-full"
              />
            </div>
          )}
        </MobileNav>
      </Navbar>
    </div>
  );
});

DashboardNavbar.displayName = "DashboardNavbar";