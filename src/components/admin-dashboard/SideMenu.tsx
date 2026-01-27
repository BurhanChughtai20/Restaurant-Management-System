"use client";

import React, { useState, useCallback, useMemo } from "react";
import { styled } from "@mui/material/styles";
import {
  Box, Stack, Typography, IconButton, Avatar,
  Drawer as MuiDrawer, Menu, MenuItem as MuiMenuItem,
} from "@mui/material";
import { ChevronLeft, ChevronRight, Command, MoreVertical, Trash2, LogOut } from "lucide-react";
import MenuContent from "./MenuContent";
import { MAIN_MENU_ITEMS, SECONDARY_MENU_ITEMS } from "@/config/menuConfig";
import { useAppNavigation } from "@/lib/useAppNavigation";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { selectUser, logout } from "@/app/store/slices/authSlice";
import {  NavMenuItem, SideMenuProps, useDeleteAccountMutation } from "@/app/store/api";
import { useRouter } from "next/navigation";

const DRAWER_THEME = {
  EXPANDED: 240,
  COLLAPSED: 52,
  COLORS: {
    BG: "#ffffff",
    BORDER: "#f0f0f0",
    FOOTER_LINE: "#f5f5f5",
    ACCENT: "black"
  }
} as const;

const UI_STRINGS = {
  LOADING: "...",
  DEFAULT_INITIAL: "U",
  CONFIRM_DELETE: "Are you sure? This action is permanent."
} as const;

const StyledDrawer = styled(MuiDrawer, { 
  shouldForwardProp: (prop) => prop !== "open" 
})<{ open?: boolean }>(({ theme, open }) => ({
  width: DRAWER_THEME.EXPANDED,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    width: DRAWER_THEME.EXPANDED,
    backgroundColor: DRAWER_THEME.COLORS.BG,
    borderRight: `1px solid ${DRAWER_THEME.COLORS.BORDER}`,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    ...(!open && {
      width: DRAWER_THEME.COLLAPSED,
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
  const [uiState, setUiState] = useState({ mounted: false, open: !collapsed });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { dashboard } = useAppNavigation();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
const router = useRouter();


  React.useEffect(() => {
    setUiState(prev => ({ ...prev, mounted: true }));
  }, []);

  const handleMenuAction = useCallback((event?: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event ? event.currentTarget : null);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    handleMenuAction();
  }, [dispatch, handleMenuAction]);

const handleDeleteAccount = useCallback(async () => {
  if (!window.confirm(UI_STRINGS.CONFIRM_DELETE)) return;

  try {
    await deleteAccount().unwrap(); // call API
    dispatch(logout());              // clear Redux state
    router.push("/");                // redirect to homepage
  } catch (err) {
    console.error("Account deletion failed:", err);
    alert("Failed to delete account. Please try again.");
  } 
}, [deleteAccount, dispatch, router]);
  const handleToggle = useCallback(() => {
    setUiState(prev => ({ ...prev, open: !prev.open }));
    onToggle?.();
  }, [onToggle]);
const handleNavigation = useCallback(
  (item: NavMenuItem) => {
    if (item.route) dashboard.goToPath(item.route); // now exists
  },
  [dashboard]
);



  const userData = useMemo(() => {
    if (!uiState.mounted) return { name: "", role: "", email: "", initial: UI_STRINGS.DEFAULT_INITIAL };
    const active = userProfile || user;
    const name = active?.name || "";
    return {
      name: name || UI_STRINGS.LOADING,
      role: active?.role || UI_STRINGS.LOADING,
      email: active?.email || UI_STRINGS.LOADING,
      initial: name ? name.charAt(0).toUpperCase() : UI_STRINGS.DEFAULT_INITIAL
    };
  }, [uiState.mounted, userProfile, user]);

  return (
    <StyledDrawer variant="permanent" open={uiState.open} component="aside">
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: uiState.open ? "space-between" : "center", p: 2 }}>
        {uiState.open && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ bgcolor: DRAWER_THEME.COLORS.ACCENT, borderRadius: 1.5, p: 0.6, display: "flex" }}>
              <Command size={20} color="white" />
            </Box>
            <Typography variant="h6" fontWeight={800} sx={{ color: DRAWER_THEME.COLORS.ACCENT }} noWrap>
              {userData.name}
            </Typography>
          </Stack>
        )}
        <IconButton onClick={handleToggle} aria-label="toggle sidebar">
          {uiState.open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </IconButton>
      </Box>

      <Box sx={{ overflowY: "auto", flexGrow: 1, px: 1 }}>
      <MenuContent
  main={mainMenu}
  secondary={secondaryMenu}
  collapsed={!uiState.open}
  onSelect={handleNavigation}
/>

      </Box>

      <Stack direction="row" sx={{ p: 2, borderTop: `1px solid ${DRAWER_THEME.COLORS.FOOTER_LINE}`, alignItems: "center", gap: 1.5, bgcolor: DRAWER_THEME.COLORS.BG }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: DRAWER_THEME.COLORS.ACCENT, fontSize: "0.9rem" }}>
          {userData.initial}
        </Avatar>
        {uiState.open && (
          <>
            <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
              <Typography variant="body2" fontWeight={600} noWrap>{userData.role}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>{userData.email}</Typography>
            </Box>
            <IconButton size="small" onClick={handleMenuAction}><MoreVertical size={16} /></IconButton>
            <Menu 
              anchorEl={anchorEl} 
              open={Boolean(anchorEl)} 
              onClose={() => handleMenuAction()}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MuiMenuItem onClick={handleDeleteAccount} sx={{ color: 'error.main' }} disabled={isLoading}>
                <Trash2 size={16} style={{ marginRight: 8 }} /> 
                {isLoading ? "Deleting..." : "Delete Account"}
              </MuiMenuItem>
              <MuiMenuItem onClick={handleLogout}>
                <LogOut size={16} style={{ marginRight: 8 }} /> Logout
              </MuiMenuItem>
            </Menu>
          </>
        )}
      </Stack>
    </StyledDrawer>
  );
};

export default SideMenu;