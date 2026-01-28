"use client";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Stack,
  Box,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { MenuContentProps, NavMenuItem } from "./types";

const MenuSection = ({
  items,
  collapsed,
  pathname,
  onSelect,
}: {
  items: NavMenuItem[];
  collapsed: boolean;
  pathname: string;
  onSelect?: (item: NavMenuItem) => void;
}) => (
  <List dense>
    {items.map((item) => {
      // Logic: Exact match or sub-route match
      const active =
        pathname === item.route || pathname.startsWith(`${item.route}/`);
      return (
        <ListItem key={item.route} disablePadding>
          <Tooltip title={collapsed ? item.label : ""} placement="right">
            <ListItemButton
              selected={active}
              onClick={() => onSelect?.(item)}
              sx={{
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 1,
                mb: 0.5,
                mx: 1,
                "&.Mui-selected": {
                  bgcolor: "#f0f0f0", // light gray background for active item
                  color: "black", // text color
                  "& .MuiListItemIcon-root": { color: "black" }, // icon color
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 40,
                  color: active ? "inherit" : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: active ? 700 : 500 }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      );
    })}
  </List>
);

export default function MenuContent({
  main,
  secondary,
  collapsed = false,
  onSelect,
}: MenuContentProps) {
  const pathname = usePathname();

  return (
    <Stack justifyContent="space-between" height="100%">
      <Box>
        <MenuSection
          items={main.items}
          collapsed={collapsed}
          pathname={pathname}
          onSelect={onSelect}
        />
      </Box>

      {secondary && (
        <Box sx={{ mt: "auto", pb: 2 }}>
          <Divider sx={{ my: 1, mx: 2 }} />
          <MenuSection
            items={secondary.items}
            collapsed={collapsed}
            pathname={pathname}
            onSelect={onSelect}
          />
        </Box>
      )}
    </Stack>
  );
}
