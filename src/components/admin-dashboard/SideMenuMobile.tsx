"use client";

import React, { useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { FloatingDock } from "@/components/ui/floating-dock";
import { X, Menu } from "lucide-react";
import { useDashboardNavigation } from "@/lib/useDashboardNavigation";
import { DASHBOARD_ROUTES, MAIN_MENU_ITEMS } from "@/config/menuConfig";

const NAVBAR_HEIGHT = 50;

export default function MobileFloatingMenu() {
  const dashboardNav = useDashboardNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleClick = useCallback(
    (route: keyof typeof DASHBOARD_ROUTES) => {
      dashboardNav.goTo(route);
      setMobileMenuOpen(false);
    },
    [dashboardNav]
  );

  const floatingDockItems = useMemo(
    () =>
      MAIN_MENU_ITEMS.map((item) => ({
        title: item.label,
        icon: (
          <Stack alignItems="center" spacing={0.5} sx={{ minWidth: 48, cursor: "pointer" }}>
            <IconButton>{item.icon}</IconButton>
            <Typography variant="caption" fontWeight={500}>
              {item.label}
            </Typography>
          </Stack>
        ),
        href: "#",
        onClick: () => handleClick(item.route as keyof typeof DASHBOARD_ROUTES),
      })),
    [handleClick]
  );

  return (
    <>
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
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </IconButton>
      </Box>

      {mobileMenuOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: NAVBAR_HEIGHT,
            left: 0,
            width: "100%",
            px: 2,
            zIndex: 1400,
          }}
        >
          <FloatingDock items={floatingDockItems} mobileClassName="translate-y-0" />
        </Box>
      )}
    </>
  );
}
