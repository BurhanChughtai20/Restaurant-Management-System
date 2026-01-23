"use client";

import React, { useState, memo, useCallback } from "react";
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
import ButtonCom from "./Button";
import { Home,  CircleDollarSign, BookText, ArrowRight } from "lucide-react";
import { useAppNavigation } from "@/lib/useAppNavigation";
import { APP_ROUTES } from "@/config/routes";

const classes = {
  container: "relative w-full fixed top-0 left-0 right-0 z-50",
  desktopButtonContainer: "hidden md:flex items-center gap-4",
  mobileMenuContent: "flex flex-col gap-6 py-4",
  mobileLink: "flex items-center gap-3 text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 transition-colors font-medium text-lg",
  mobileLinkIcon: "text-black",
  mobileLinkText: "text-gray-800 text-sm",
  mobileButtonWrapper: "flex w-full flex-col gap-4 mt-4",
  mobileButton: "w-full my-primary-btn",
};

// --- Nav items using centralized APP_ROUTES ---
const navItems = [
  { name: "Home", routeKey: "home" as const, icon: <Home size={18} /> },
  { name: "Pricing", routeKey: "pricing" as const, icon: <CircleDollarSign size={18} /> },
  { name: "Blog", routeKey: "blog" as const, icon: <BookText size={18} /> },
];

export const NavbarCom = memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { app: appNav } = useAppNavigation(); // centralized navigation

  const handleSignUpClick = useCallback(() => {
    setIsMobileMenuOpen(false);
    appNav.goTo("home"); // type-safe navigation
  }, [appNav]);

  return (
    <div className={classes.container}>
      <Navbar>
        <NavBody>
          <NavbarLogo />

          <NavItems
            items={navItems.map((item) => ({
              name: item.name,
              link: APP_ROUTES[item.routeKey],
              icon: item.icon,
            }))}
          />

          <div className={classes.desktopButtonContainer}>
            <ButtonCom
              icon={<ArrowRight size={16} />}
              iconPosition="right"
              text="Get Started"
              type="default"
              className="my-primary-btn"
              onClick={handleSignUpClick}
            />
          </div>
        </NavBody>

        {/* --- Mobile Navigation --- */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <div className={classes.mobileMenuContent}>
              {navItems.map((item, idx) => (
                <button
                  key={`mobile-link-${idx}`}
                  onClick={() => {
                    appNav.goTo(item.routeKey); // type-safe
                    setIsMobileMenuOpen(false);
                  }}
                  className={classes.mobileLink}
                >
                  <span className={classes.mobileLinkIcon}>{item.icon}</span>
                  <span className={classes.mobileLinkText}>{item.name}</span>
                </button>
              ))}
            </div>

            {/* --- Mobile Action Button --- */}
            <div className={classes.mobileButtonWrapper}>
              <ButtonCom
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                text="Get Started"
                type="default"
                className={classes.mobileButton}
                onClick={handleSignUpClick}
              />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
});

NavbarCom.displayName = "NavbarCom";
