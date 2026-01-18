"use client";
import React, { useState, memo, useCallback } from "react";
import { useRouter } from "next/navigation"; // Import the router for navigation
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
import { 
  Home, 
  LayoutGrid, 
  CircleDollarSign, 
  BookText, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/auth/routes";

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

const navItems = [
  { name: "Home", link: APP_ROUTES.home, icon: <Home size={18} /> },
  { name: "Product", link: APP_ROUTES.product, icon: <LayoutGrid size={18} /> },
  { name: "Pricing", link: APP_ROUTES.pricing, icon: <CircleDollarSign size={18} /> },
  { name: "Blog", link: APP_ROUTES.blog, icon: <BookText size={18} /> },
];

export const NavbarCom = memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Optimized click handler for navigation
  const handleSignUpClick = useCallback(() => {
    setIsMobileMenuOpen(false); // Ensure menu closes on mobile
    router.push("/signup");      // Navigate to your new SEO-optimized page
  }, [router]);

  return (
    <div className={classes.container}>
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          
          {/* --- Desktop Action Button --- */}
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
                <Link
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={classes.mobileLink}
                >
                  <span className={classes.mobileLinkIcon}>{item.icon}</span>
                  <span className={classes.mobileLinkText}>{item.name}</span>
                </Link>
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