"use client";
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
import { useState } from "react";
import ButtonCom from "./Button";
  


export function NavbarCom() {
  const navItems = [
    {
      name: "Home",
      link: "",
    },
    {
      name: "About",
      link: "",
    },
    {
      name: "Product",
      link: "",
    },
     {
      name: "Pricing",
      link: "",
    },
    {
      name: "Blog",
      link: "",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4"> 
             <ButtonCom 
            text="Get Started" 
              type="default"       
              color=""
              className="my-primary-btn"
            onClick={() => alert('Started 🚀')} />
          </div>
        </NavBody>

        {/* Mobile Navigation */}
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
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
            <ButtonCom
  text="Get Started"
  type="default"       
color=""
  className="my-primary-btn"
  onClick={() => alert('Started 🚀')}
/>



            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar> 

      {/* Navbar */}
    </div>
  );
}
 
