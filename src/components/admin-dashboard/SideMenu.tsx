"use client";

import React, { useState, useCallback, useMemo } from "react";
import { styled } from "@mui/material/styles";
import { Box, Stack, Typography, IconButton, Avatar, Drawer as MuiDrawer } from "@mui/material";
import { ChevronLeft, ChevronRight, Command, MoreVertical } from "lucide-react";
import MenuContent from "./MenuContent";
import { SideMenuConfig, MenuItem } from "./types";
import { MAIN_MENU_ITEMS, SECONDARY_MENU_ITEMS, DashboardRouteKey } from "@/config/menuConfig";
import { useAppNavigation } from "@/lib/useAppNavigation";

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 52;

const StyledDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: EXPANDED_WIDTH,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    "& .MuiDrawer-paper": {
      width: EXPANDED_WIDTH,
      backgroundColor: "#ffffff",
      borderRight: "1px solid #f0f0f0",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      ...(!open && {
        width: COLLAPSED_WIDTH,
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }),
    },
  })
);

interface SideMenuProps extends Partial<SideMenuConfig> {
  collapsed?: boolean;
  onToggle?: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({
  collapsed = false,
  onToggle,
  userProfile = { name: "Admin", email: "admin@restaurant.com" },
  mainMenu = { items: MAIN_MENU_ITEMS },
  secondaryMenu = { items: SECONDARY_MENU_ITEMS },
}) => {
  const [open, setOpen] = useState(!collapsed);
  const { dashboard } = useAppNavigation();

  /** DRY toggle handler */
  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
    onToggle?.();
  }, [onToggle]);

  /** DRY navigation handler */
  const handleNavigation = useCallback(
    (item: MenuItem) => {
      if (item.route) dashboard.goTo(item.route as DashboardRouteKey);
    },
    [dashboard]
  );

  /** Precompute user initials */
  const userInitial = useMemo(() => userProfile?.name?.charAt(0) ?? "A", [userProfile?.name]);

  return (
    <StyledDrawer variant="permanent" open={open}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          p: 2,
        }}
      >
        {open && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ bgcolor: "black", borderRadius: 1.5, p: 0.6, display: "flex" }}>
              <Command size={20} color="white" />
            </Box>
            <Typography variant="h6" fontWeight={800} sx={{ color: "black" }}>
              Nexus
            </Typography>
          </Stack>
        )}
        <IconButton onClick={handleToggle}>
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </IconButton>
      </Box>

      {/* Menu */}
      <Box sx={{ overflowY: "auto", flexGrow: 1, px: 1 }}>
        <MenuContent main={mainMenu} secondary={secondaryMenu} onSelect={handleNavigation} />
      </Box>

      {/* Footer */}
      <Stack
        direction="row"
        sx={{
          p: 2,
          borderTop: "1px solid #f5f5f5",
          alignItems: "center",
          gap: 1.5,
          bgcolor: "#ffffff",
        }}
      >
        <Avatar sx={{ width: 36, height: 36 }}>{userInitial}</Avatar>
        {open && (
          <>
            <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {userProfile?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {userProfile?.email}
              </Typography>
            </Box>
            <IconButton size="small">
              <MoreVertical size={16} />
            </IconButton>
          </>
        )}
      </Stack>
    </StyledDrawer>
  );
};

export default SideMenu;