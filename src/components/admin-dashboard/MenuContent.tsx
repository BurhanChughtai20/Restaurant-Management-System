"use client";

import React from "react";
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

interface MenuSectionProps {
  items: NavMenuItem[];
  collapsed: boolean;
  pathname: string;
  onSelect?: (item: NavMenuItem) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  collapsed,
  pathname,
  onSelect,
}) => (
  <List dense>
    {items.map((item) => {
      // Check if current path exactly matches or is a sub-route of the menu item
      const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
      
      return (
        <ListItem key={item.id} disablePadding>
          <Tooltip title={collapsed ? item.label : ""} placement="right">
            <ListItemButton
              selected={isActive}
              onClick={() => onSelect?.(item)}
              sx={{
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 1.5,
                mb: 0.5,
                mx: 1,
                transition: "all 0.2s ease-in-out",
                "&.Mui-selected": {
                  bgcolor: "rgba(0, 0, 0, 0.08)",
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.12)" },
                  "& .MuiListItemIcon-root": { color: "primary.main" },
                  "& .MuiListItemText-primary": { color: "primary.main", fontWeight: 700 },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 40,
                  color: isActive ? "primary.main" : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ 
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 700 : 500 
                  }}
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
  currentPath,
}: MenuContentProps): React.JSX.Element {
  const hookPathname = usePathname();
  const activePath = currentPath || hookPathname || "";

  return (
    <Stack justifyContent="space-between" height="100%">
      <Box sx={{ py: 1 }}>
        <MenuSection
          items={main.items}
          collapsed={collapsed}
          pathname={activePath}
          onSelect={onSelect}
        />
      </Box>

      {secondary && (
        <Box sx={{ mt: "auto", pb: 2 }}>
          <Divider sx={{ my: 1, mx: 2, opacity: 0.6 }} />
          <MenuSection
            items={secondary.items}
            collapsed={collapsed}
            pathname={activePath}
            onSelect={onSelect}
          />
        </Box>
      )}
    </Stack>
  );
}