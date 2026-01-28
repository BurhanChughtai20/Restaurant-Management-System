import { ReactNode } from "react";
import { GridColDef, GridRowsProp, GridRowSelectionModel } from "@mui/x-data-grid";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import type { Dayjs } from "dayjs";

/* ───────────────── USER ───────────────── */

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}


/* ───────────────── ROUTES ───────────────── */

export type RouteKey = string;

/* ───────────────── MENU ───────────────── */

export interface NavMenuItem {
  id: string | number;
  label: string;
  icon: React.ReactNode;
  route: string;
  onClick?: () => void;
}

export interface MenuGroup {
  items: NavMenuItem[];
}

export interface SideMenuProps {
  collapsed?: boolean;
  onToggle?: () => void;
  userProfile?: UserProfile;
  mainMenu?: MenuGroup;
  secondaryMenu?: MenuGroup;
}

export interface MenuContentProps {
  main: MenuGroup;                  // required main menu
  secondary?: MenuGroup;            // optional secondary menu
  collapsed?: boolean;              // is the sidebar collapsed
  onSelect?: (item: NavMenuItem) => void; // callback when a menu item is clicked
  activeRoute?: string;             // optional: current path for active styling
}

/* ───────────────── GRID ───────────────── */

export type TrendDirection = "up" | "down" | "neutral";

export interface StatCardData {
  title: string;
  value: string;
  interval: string;
  trend: TrendDirection;
  data: number[];
}

export interface DataGridConfig {
  rows: GridRowsProp;
  columns: GridColDef[];
  pageSize?: number;
  pageSizeOptions?: number[];
  checkboxSelection?: boolean;
  onSelectionChange?: (model: GridRowSelectionModel) => void;
}

/* ───────────────── TREE ───────────────── */

export type TreeItemColor = "" | "green"; 

export type TreeItem = TreeViewBaseItem<{
  id: string;
  label: string;
  color?: TreeItemColor;
}>;

export interface TreeViewConfig {
  title: string;
  items: TreeItem[];
  defaultExpanded?: string[];
  defaultSelected?: string[];
  multiSelect?: boolean;
}

/* ───────────────── MAIN GRID ───────────────── */

export interface MainGridConfig {
  overviewTitle: string;
  detailsTitle: string;
  statCards: StatCardData[];
  highlightedCard?: {
    title: string;
    description: string;
    buttonText: string;
    onClick?: () => void;
  };
  dataGrid?: DataGridConfig;
  treeView?: TreeViewConfig;
}

/* ───────────────── LAYOUT ───────────────── */

export interface LayoutConfig {
  title: string;
  mainGrid: MainGridConfig;
  sideMenu: SideMenuProps;
}

export interface CardAlertConfig {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export interface DatePickerConfig {
  value?: Dayjs | null;
  defaultValue?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
  label?: string;
  views?: ("day" | "month" | "year")[];
}

export interface HighlightedCardConfig {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  progress?: {
    value: number;
    max: number;
    label?: string;
  };
  onClick?: () => void;
  loading?: boolean;
}
