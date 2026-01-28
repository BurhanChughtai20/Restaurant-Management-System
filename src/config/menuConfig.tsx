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
import { DASHBOARD_ROUTES } from "@/config/routes";
import { NavMenuItem } from "@/components/admin-dashboard/types";

export const MAIN_MENU_ITEMS: NavMenuItem[] = [
  { id: 1, label: "Dashboard", icon: <LayoutDashboard size={20} />, route: DASHBOARD_ROUTES.dashboard },
  { id: 2, label: "Menu", icon: <Utensils size={20} />, route: DASHBOARD_ROUTES.MenuItem },
  { id: 3, label: "Orders", icon: <ClipboardCheck size={20} />, route: DASHBOARD_ROUTES.Order_Taker },
  { id: 4, label: "Chef", icon: <ChefHat size={20} />, route: DASHBOARD_ROUTES.Chef },
  { id: 5, label: "Articles", icon: <FileText size={20} />, route: DASHBOARD_ROUTES.Article },
  { id: 6, label: "WhatsApp Bot", icon: <MessageCircle size={20} />, route: DASHBOARD_ROUTES.whatsapp_bot },
];

export const SECONDARY_MENU_ITEMS: NavMenuItem[] = [
  { id: 7, label: "Profile", icon: <User size={18} />, route: DASHBOARD_ROUTES.profile },
  { id: 8, label: "Settings", icon: <Settings size={18} />, route: DASHBOARD_ROUTES.settings },
  { id: 9, label: "Help", icon: <HelpCircle size={18} />, route: DASHBOARD_ROUTES.help },
  { id: 10, label: "Delete Account", icon: <Trash2 size={18} />, route: "/dashboard/delete-account" },
];
