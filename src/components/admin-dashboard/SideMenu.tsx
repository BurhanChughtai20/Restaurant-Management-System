"use client";

import React, { useState, useCallback, useMemo } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Avatar,
  Drawer as MuiDrawer,
  Menu,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import { ChevronLeft, ChevronRight, Command, MoreVertical, Trash2 } from "lucide-react";
import MenuContent from "./MenuContent";
import { MenuItem } from "./types";
import { MAIN_MENU_ITEMS, SECONDARY_MENU_ITEMS, DashboardRouteKey } from "@/config/menuConfig";
import { useAppNavigation } from "@/lib/useAppNavigation";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { selectUser, logout, deleteAccountSuccess } from "@/app/store/slices/authSlice";

interface UserProfile {
  name: string;
  email: string;
  id?: number;
  role?: string;
}

interface SideMenuProps {
  collapsed?: boolean;
  onToggle?: () => void;
  userProfile?: UserProfile;
  mainMenu?: { items: MenuItem[] };
  secondaryMenu?: { items: MenuItem[] };
}

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 52;

const StyledDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
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
}));

const SideMenu: React.FC<SideMenuProps> = ({
  collapsed = false,
  onToggle,
  userProfile,
  mainMenu = { items: MAIN_MENU_ITEMS },
  secondaryMenu = { items: SECONDARY_MENU_ITEMS },
}) => {
  const [open, setOpen] = useState(!collapsed);
  const { dashboard } = useAppNavigation();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  // Footer Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Logout handler
  const handleLogout = useCallback(() => {
    dispatch(logout());
    handleMenuClose();
  }, [dispatch]);

  // Delete Account handler
  const handleDeleteAccount = useCallback(() => {
    handleMenuClose();
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Call delete account API here if needed
      dispatch(deleteAccountSuccess());
    }
  }, [dispatch]);

  // Sidebar toggle
  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
    onToggle?.();
  }, [onToggle]);

  // Navigation
  const handleNavigation = useCallback(
    (item: MenuItem) => {
      if (item.route) dashboard.goTo(item.route as DashboardRouteKey);
    },
    [dashboard]
  );

  const userInitial = useMemo(
    () => userProfile?.name?.charAt(0).toUpperCase() ?? user?.name?.charAt(0)?.toUpperCase() ?? "U",
    [userProfile?.name, user?.name]
  );

  return (
    <StyledDrawer variant="permanent" open={open}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: open ? "space-between" : "center", p: 2 }}>
        {open && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ bgcolor: "black", borderRadius: 1.5, p: 0.6, display: "flex" }}>
              <Command size={20} color="white" />
            </Box>
            <Typography variant="h6" fontWeight={800} sx={{ color: "black" }}>
              {user?.name || "Loading..."}
            </Typography>
          </Stack>
        )}
        <IconButton onClick={handleToggle}>{open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}</IconButton>
      </Box>

      {/* Menu */}
      <Box sx={{ overflowY: "auto", flexGrow: 1, px: 1 }}>
        <MenuContent main={mainMenu} secondary={secondaryMenu} onSelect={handleNavigation} />
      </Box>

      {/* Footer */}
      <Stack
        direction="row"
        sx={{ p: 2, borderTop: "1px solid #f5f5f5", alignItems: "center", gap: 1.5, bgcolor: "#ffffff" }}
      >
        <Avatar sx={{ width: 36, height: 36, bgcolor: "black", fontSize: "0.9rem" }}>{userInitial}</Avatar>
        {open && (
          <>
            <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {user?.role || "Loading..."}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                {user?.email || "Checking session..."}
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVertical size={16} />
            </IconButton>

            {/* Dropdown Menu */}
            <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
              <MuiMenuItem onClick={handleDeleteAccount}>
                <Trash2 size={16} style={{ marginRight: 8 }} />
                Delete Account
              </MuiMenuItem>
              <MuiMenuItem onClick={handleLogout}>Logout</MuiMenuItem>
            </Menu>
          </>
        )}
      </Stack>
    </StyledDrawer>
  );
};

export default SideMenu;
