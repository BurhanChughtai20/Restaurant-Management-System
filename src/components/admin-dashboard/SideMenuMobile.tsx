"use client";

import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { MenuItem } from "./types";
import { useDashboardNavigation } from "@/lib/useDashboardNavigation";
import { DASHBOARD_ROUTES, MAIN_MENU_ITEMS } from "@/config/menuConfig";

const NAVBAR_HEIGHT = 70;

type SideMenuMobileProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SideMenuMobile = ({ isOpen, onClose }: SideMenuMobileProps) => {
  const dashboardNav = useDashboardNavigation();

  const handleClick = (item: MenuItem) => {
    dashboardNav.goTo(item.route as keyof typeof DASHBOARD_ROUTES);
    onClose();
  };

  return (
    <Drawer
      anchor="bottom"
      open={isOpen}
      onClose={onClose}
      variant="temporary"
      sx={{
        zIndex: (theme) => theme.zIndex.appBar - 1,
        "& .MuiDrawer-paper": {
          height: `calc(100% - ${NAVBAR_HEIGHT}px)`,
          bottom: NAVBAR_HEIGHT,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        },
      }}
    >
      <Box sx={{ display: "flex", px: 2, py: 1.5, gap: 2, overflowX: "auto" }}>
        {MAIN_MENU_ITEMS.map((item) => (
          <Stack
            key={item.label}
            alignItems="center"
            spacing={0.5}
            minWidth={72}
            onClick={() => handleClick(item)}
            sx={{ cursor: "pointer" }}
          >
            <IconButton>{item.icon}</IconButton>
            <Typography variant="caption" fontWeight={500}>
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Drawer>
  );
};

export default SideMenuMobile;
