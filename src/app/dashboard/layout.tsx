"use client";
import React, { useState } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import SideMenu from "@/components/admin-dashboard/SideMenu";

const EXPANDED_WIDTH = 20;
const COLLAPSED_WIDTH = -150;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AppRouterCacheProvider>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <SideMenu
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            transition: "margin-left 0.3s ease, width 0.3s ease",
            width: `calc(90% - ${sidebarOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH}px)`,
            marginLeft: `${sidebarOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH}px`,
          }}
        >
          {children}
        </Box>
      </Box>
    </AppRouterCacheProvider>
  );
}
