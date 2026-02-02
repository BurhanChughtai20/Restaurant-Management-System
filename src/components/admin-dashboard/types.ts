import type { ReactNode } from "react"
import type { Dayjs } from "dayjs"

/* ───────────────── USER ───────────────── */

export interface UserProfile {
  name: string
  email: string
  avatarUrl?: string
  role?: string
}

/* ───────────────── ROUTES ───────────────── */

/**
 * Logical route key (used by navigation helpers)
 * Example: "dashboard", "users", "settings"
 */
export type RouteKey = string

/* ───────────────── MENU ───────────────── */

export interface NavMenuItem {
  id: string | number
  label: string
  icon?: ReactNode
  route: string
  disabled?: boolean
}

export interface MenuGroup {
  label?: string
  items: NavMenuItem[]
}

export interface MenuContentProps {
  main: MenuGroup
  secondary?: MenuGroup
  currentPath?: string
  onSelect?: (item: NavMenuItem) => void
}

export interface SideMenuProps {
  userProfile?: UserProfile
  mainMenu?: MenuGroup
  secondaryMenu?: MenuGroup
}

/* ───────────────── MENU STATE ───────────────── */

export interface MenuItemsState {
  loading: boolean
  error: string | null
  searchQuery: string
  filterIsActive: boolean | null
  currentPage: number
  itemsPerPage: number
}

/* ───────────────── STATS / ANALYTICS ───────────────── */

export type TrendDirection = "up" | "down" | "neutral"

export interface StatCardData {
  title: string
  value: string | number
  interval?: string
  trend?: TrendDirection
  data?: number[]
}

/* ───────────────── TABLE / GRID (UI-AGNOSTIC) ───────────────── */

/**
 * Generic column definition (not tied to MUI / AntD)
 */
export interface TableColumn<T = unknown> {
  key: keyof T | string
  header: string
  width?: number
  align?: "left" | "center" | "right"
  render?: (row: T) => ReactNode
}

export interface TableConfig<T = unknown> {
  rows: T[]
  columns: TableColumn<T>[]
  pageSize?: number
  pageSizeOptions?: number[]
  selectable?: boolean
  onSelectionChange?: (selectedIds: Array<string | number>) => void
}

/* ───────────────── TREE (HEADLESS) ───────────────── */

export type TreeItemColor = "default" | "green"

export interface TreeItem {
  id: string
  label: string
  color?: TreeItemColor
  children?: TreeItem[]
}

export interface TreeViewConfig {
  title?: string
  items: TreeItem[]
  defaultExpanded?: string[]
  defaultSelected?: string[]
  multiSelect?: boolean
}

/* ───────────────── MAIN GRID / DASHBOARD ───────────────── */

export interface HighlightedCardConfig {
  title: string
  description?: string
  buttonText?: string
  onClick?: () => void
}

export interface MainGridConfig {
  overviewTitle?: string
  detailsTitle?: string
  statCards?: StatCardData[]
  highlightedCard?: HighlightedCardConfig
  table?: TableConfig
  treeView?: TreeViewConfig
}

/* ───────────────── LAYOUT ───────────────── */

export interface LayoutConfig {
  title: string
  mainGrid: MainGridConfig
  sideMenu?: SideMenuProps
}

/* ───────────────── UI HELPERS ───────────────── */

export interface CardAlertConfig {
  title?: string
  description?: string
  buttonText?: string
  onButtonClick?: () => void
}

export interface DatePickerConfig {
  value?: Dayjs | null
  defaultValue?: Dayjs | null
  onChange?: (value: Dayjs | null) => void
  label?: string
  views?: Array<"day" | "month" | "year">
}

export interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive?: boolean
    label?: string
  }
  progress?: {
    value: number
    max: number
    label?: string
  }
  onClick?: () => void
  loading?: boolean
}

export interface ChartPayloadItem {
  type?: string; // e.g., "line", "bar"
  payload: {
    fill?: string;
    color?: string;
    [key: string]: unknown; // allows other data fields
  };
  name?: string;
  dataKey?: string | number;
  value?: string | number;
  color?: string;
}

