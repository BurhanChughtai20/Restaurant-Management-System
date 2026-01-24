"use client";

import React, { useState, memo, useCallback, useMemo } from "react";
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
  LogIn
} from "lucide-react";
import { useAppNavigation } from "@/lib/useAppNavigation";
import { DASHBOARD_ROUTES } from "@/config/routes";
import ButtonCom from "./Button";

const classes = {
  container: "relative w-full",
  // Hide entire navbar on lg+ screens when on dashboard routes
  containerDashboard: "relative w-full lg:hidden",
  navBodyWithButton: "flex items-center gap-4",
  leftSection: "flex items-center gap-4",
  rightSection: "flex items-center gap-4 ml-auto",
  mobileMenuContent: "flex flex-col gap-6 py-4",
  mobileLink: "flex items-center gap-3 text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 transition-colors font-medium text-lg",
  mobileLinkIcon: "text-black",
  mobileLinkText: "text-gray-800 text-sm",
  mobileButton: "mt-4",
  mobileButtonWrapper: "px-4 py-2",
  desktopButton: "flex",
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

  // Check if current route is a dashboard route
  const isDashboardRoute = useMemo(
    () => pathname.startsWith('/dashboard'),
    [pathname]
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

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Memoized button component for non-dashboard routes
  const GetStartedButton = useMemo(
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

  // If on dashboard route, only render for mobile/tablet (handled by container class)
  // If on non-dashboard route, render both NavBody and MobileNav properly
  return (
    <div className={isDashboardRoute ? classes.containerDashboard : classes.container}>
      <Navbar>
        {/* Desktop Navigation - ONLY for non-dashboard routes */}
        {!isDashboardRoute && (
          <NavBody className={classes.navBodyWithButton}>
            <div className={classes.leftSection}>
              <NavbarLogo />
            </div>
            <div className={classes.rightSection}>
              {GetStartedButton}
            </div>
          </NavBody>
        )}

        {/* Mobile Navigation */}
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

          {/* Different content based on route type */}
          {isDashboardRoute ? (
            /* Dashboard routes: Show dropdown menu */
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
              </div>
            </MobileNavMenu>
          ) : (
            /* Non-dashboard routes: Show button */
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