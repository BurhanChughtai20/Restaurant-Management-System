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
} from "@mui/material";
import { usePathname } from "next/navigation";
import { MenuGroup, MenuItem } from "./types";

interface MenuContentProps {
  main: MenuGroup;
  secondary?: MenuGroup;
  collapsed?: boolean;
  onSelect?: (item: MenuItem) => void;
}

const MenuSection = ({
  items,
  collapsed,
  pathname,
  onSelect,
}: {
  items: MenuItem[];
  collapsed: boolean;
  pathname: string;
  onSelect?: (item: MenuItem) => void;
}) => (
  <List dense>
    {items.map((item) => {
      const active = pathname.endsWith(item.route);
      return (
        <ListItem key={item.route} disablePadding>
          <Tooltip title={collapsed ? item.label : ""} placement="right">
            <ListItemButton
              selected={active}
              onClick={() => onSelect?.(item)}
              sx={{ justifyContent: collapsed ? "center" : "flex-start" }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} />}
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
      <MenuSection
        items={main.items}
        collapsed={collapsed}
        pathname={pathname}
        onSelect={onSelect}
      />

      {secondary && (
        <>
          <Divider />
          <MenuSection
            items={secondary.items}
            collapsed={collapsed}
            pathname={pathname}
            onSelect={onSelect}
          />
        </>
      )}
    </Stack>
  );
}
