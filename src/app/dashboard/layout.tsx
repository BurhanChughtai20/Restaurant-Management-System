"use client";

import React, { useState, useCallback } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import SideMenu from "@/components/admin-dashboard/SideMenu";
import SideMenuMobile from "@/components/admin-dashboard/SideMenuMobile";
import { CrossIcon, MenuIcon } from "lucide-react";

const EXPANDED_WIDTH = 0;
const COLLAPSED_WIDTH = -162;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // DRY toggle functions
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(prev => !prev), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  // Computed styles
  const mainWidth = `calc(100% - ${sidebarOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH}px)`;
  const mainMargin = `${sidebarOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH}px`;

  return (
    <AppRouterCacheProvider>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Desktop Sidebar & Main */}
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Box sx={{ display: { lg: "block", xs: "none" } }}>
            <SideMenu collapsed={!sidebarOpen} onToggle={toggleSidebar} />
          </Box>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              transition: "margin-left 0.3s ease, width 0.3s ease",
              width: { lg: mainWidth, xs: "100%" },
              marginLeft: { lg: mainMargin, xs: 0 },
            }}
          >
            {children}
          </Box>
        </Box>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <Box sx={{ display: { xs: "flex", md: "flex", lg: "none" } }}>
            <SideMenuMobile isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
          </Box>
        )}

        {/* Mobile Toggle Button */}
        <Box
          sx={{
            display: { xs: "flex", md: "flex", lg: "none" },
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1500,
          }}
        >
          <IconButton
            onClick={toggleMobileMenu}
            sx={{ bgcolor: "black", color: "white", "&:hover": { bgcolor: "black" } }}
          >
            {mobileMenuOpen ? <CrossIcon size={20} /> : <MenuIcon size={20} />}
          </IconButton>
        </Box>
      </Box>
    </AppRouterCacheProvider>
  );
}
