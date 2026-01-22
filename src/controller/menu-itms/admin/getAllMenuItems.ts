import prisma from "../../../libs/prisma.ts";
import { GetAllMenuItemsParams, PaginatedMenuItems } from "../../../shared/index.ts";

export async function getAllMenuItems({
  restaurantId,
  limit = 10,
  cursorId,
}: GetAllMenuItemsParams): Promise<PaginatedMenuItems> {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId },
      take: limit,
      ...(cursorId !== undefined ? { cursor: { id: cursorId }, skip: 1 } : {}),
      orderBy: { id: "asc" },
    });

    const nextCursor = menuItems[menuItems.length - 1]?.id ?? null;

    return {
      data: menuItems,
      nextCursor,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch menu items");
  }
}
