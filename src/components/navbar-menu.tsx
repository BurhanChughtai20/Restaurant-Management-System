"use client";
import React, { useState } from "react";
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
// Import icons for the menu items
import { 
  Home, 
  LayoutGrid, 
  CircleDollarSign, 
  BookText, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";

export function NavbarCom() {
  // 1. Added an 'icon' property to each nav item
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <Home size={18} />,
    },
    {
      name: "Product",
      link: "/product",
      icon: <LayoutGrid size={18} />,
    },
    {
      name: "Pricing",
      link: "/pricing",
      icon: <CircleDollarSign size={18} />,
    },
    {
      name: "Blog",
      link: "/blog",
      icon: <BookText size={18} />,
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          {/* Note: Ensure your NavItems component is updated to handle icons, 
             otherwise they will only show in the MobileNav below. 
          */}
          <NavItems items={navItems} />
          
          <div className="hidden md:flex items-center gap-4">
            <ButtonCom
              icon={<ArrowRight size={16} />}
              iconPosition="right"
              text="Get Started"
              type="default"
              className="my-primary-btn"
              onClick={() => alert("Started")}
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
            <div className="flex flex-col gap-6 py-4">
              {navItems.map((item, idx) => (
                <Link
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 transition-colors font-medium text-lg"
                >
                  {/* Rendering the icon next to the text */}
                  <span className="text-black">{item.icon}</span>
                  <span className="text-gray-800 text-sm">{item.name}</span>
                </Link>
              ))}
            </div>

            <div className="flex w-full flex-col gap-4 mt-4">
              <ButtonCom
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                text="Get Started"
                type="default"
                className="w-full my-primary-btn"
                onClick={() => alert("Started")}
              />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}