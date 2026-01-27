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
  Trash2,
} from "lucide-react";
import type { DashboardRouteKey } from "@/config/routes";

export const MAIN_MENU_ITEMS: NavMenuItem[] = [
  { id: 1, label: "Dashboard", icon: <LayoutDashboard size={20} />, route: "dashboard" },
  { id: 2, label: "Menu", icon: <Utensils size={20} />, route: "MenuItem" },
  { id: 3, label: "Orders", icon: <ClipboardCheck size={20} />, route: "Order_Taker" },
  { id: 4, label: "Chef", icon: <ChefHat size={20} />, route: "Chef" },
  { id: 5, label: "Articles", icon: <FileText size={20} />, route: "Article" },
  { id: 6, label: "WhatsApp Bot", icon: <MessageCircle size={20} />, route: "whatsapp_bot" },
];

export const SECONDARY_MENU_ITEMS: NavMenuItem[] = [
  { id: 7, label: "Profile", icon: <User size={18} />, route: "profile" },
  { id: 8, label: "Settings", icon: <Settings size={18} />, route: "settings" },
  { id: 9, label: "Help", icon: <HelpCircle size={18} />, route: "help" },
  { id: 10, label: "Delete Account", icon: <Trash2 size={18} />, route: "delete_account" }, // special button
];
