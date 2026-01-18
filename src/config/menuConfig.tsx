 import { MenuItem } from "@/components/admin-dashboard/types";
import {
  LayoutDashboard,
  Utensils,
  ClipboardCheck,
  ChefHat,
  FileText,
  MessageCircle,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";

export const DASHBOARD_ROUTES = {
  dashboard: "/dashboard",
  MenuItem: "/dashboard/MenuItem",
  Order_Taker: "/dashboard/Order_Taker",
  Chef: "/dashboard/Chef",
  Article: "/dashboard/article",
  whatsapp_bot: "/dashboard/whatsapp_bot",
  profile: "/dashboard/profile",
  settings: "/dashboard/settings",
  help: "/dashboard/help",
} as const;

export type DashboardRouteKey = keyof typeof DASHBOARD_ROUTES;

export const MAIN_MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, route: "dashboard" },
  { label: "Menu", icon: <Utensils size={20} />, route: "MenuItem" },
  { label: "Orders", icon: <ClipboardCheck size={20} />, route: "Order_Taker" },
  { label: "Chef", icon: <ChefHat size={20} />, route: "Chef" },
  { label: "Articles", icon: <FileText size={20} />, route: "Article" },
  { label: "WhatsApp Bot", icon: <MessageCircle size={20} />, route: "whatsapp_bot" },
];

export const SECONDARY_MENU_ITEMS: MenuItem[] = [
  { label: "Profile", icon: <User size={18} />, route: "profile" },
  { label: "Settings", icon: <Settings size={18} />, route: "settings" },
  { label: "Help", icon: <HelpCircle size={18} />, route: "help" },
];
