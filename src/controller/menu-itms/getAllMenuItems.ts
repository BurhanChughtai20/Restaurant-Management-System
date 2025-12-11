import { prisma } from "../../libs/prisma.ts";

export async function getAllMenuItems() {
  try {
    const menuItems = await prisma.menuItem.findMany();
    return menuItems;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch menu items");
  }
}
