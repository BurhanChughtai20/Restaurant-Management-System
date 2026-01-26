import prisma from "../../../libs/prisma.ts";
import type { UpdateMenuItemParams } from "../../../shared/index.ts";

export async function updateMenuItem({
  id,
  restaurantId,
  name,
  price,
  description,
  isActive,
}: UpdateMenuItemParams) {
  if (!id) throw new Error("Menu item ID is required");

  const existingItem = await prisma.menuItem.findFirst({
    where: {
      id,
      restaurantId,
    },
  });

  if (!existingItem) {
    throw new Error("Menu item not found or access denied");
  }

  const updatedItem = await prisma.menuItem.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price }),
      ...(description !== undefined && { description }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return updatedItem;
}
