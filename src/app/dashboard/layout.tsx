"use client";

import React, { useState, useCallback } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import SideMenu from "@/components/admin-dashboard/SideMenu";
import { DashboardNavbar } from "@/components/navbar-menu";

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 52;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);

  const mainWidth = `calc(100% - ${sidebarOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH}px)`;
  const mainMargin = `${sidebarOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH}px`;

  return (
    <AppRouterCacheProvider>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Desktop Sidebar - Hidden on mobile/tablet (xs, sm, md) */}
        <Box sx={{ display: { xs: "none", md: "none", lg: "block" } }}>
          <SideMenu collapsed={!sidebarOpen} onToggle={toggleSidebar} />
        </Box>

        {/* Mobile/Tablet Navbar - Shown on xs, sm, md, hidden on lg+ */}
        <Box sx={{ display: { xs: "block", md: "block", lg: "none" } }}>
          <DashboardNavbar />
        </Box>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            transition: "margin-left 0.3s ease, width 0.3s ease",
            width: { lg: mainWidth, xs: "100%" },
            marginLeft: { lg: mainMargin, xs: 0 },
            marginTop: { xs: "64px", md: "64px", lg: 0 }, // Add top margin for mobile navbar
          }}
        >
          {children}
        </Box>
      </Box>
    </AppRouterCacheProvider>
  );
}