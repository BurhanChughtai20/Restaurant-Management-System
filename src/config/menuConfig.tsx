// src/config/menuConfig.ts
import { NavMenuItem } from "@/app/store/api";
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
import { DASHBOARD_ROUTES } from "@/config/routes";
export type DashboardRouteKey = keyof typeof DASHBOARD_ROUTES;

export const MAIN_MENU_ITEMS: NavMenuItem[] = [
  { id: 1, label: "Dashboard", icon: <LayoutDashboard size={20} />, route: "/dashboard" },
  { id: 2, label: "Menu", icon: <Utensils size={20} />, route: "/menu" },
  { id: 3, label: "Orders", icon: <ClipboardCheck size={20} />, route: "/orders" },
  { id: 4, label: "Chef", icon: <ChefHat size={20} />, route: "/chef" },
  { id: 5, label: "Articles", icon: <FileText size={20} />, route: "/articles" },
  { id: 6, label: "WhatsApp Bot", icon: <MessageCircle size={20} />, route: "/whatsapp-bot" },
];

export const SECONDARY_MENU_ITEMS: NavMenuItem[] = [
  { id: 7, label: "Profile", icon: <User size={18} />, route: "/profile" },
  { id: 8, label: "Settings", icon: <Settings size={18} />, route: "/settings" },
  { id: 9, label: "Help", icon: <HelpCircle size={18} />, route: "/help" },
];
