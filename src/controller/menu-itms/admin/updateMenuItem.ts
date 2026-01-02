import prisma from "../../../libs/prisma.ts";

interface UpdateMenuItemParams {
  id: number;
  restaurantId: number; // ✅ required
  name?: string;
  price?: number;
  description?: string;
  isActive?: boolean;
}

export async function updateMenuItem({
  id,
  restaurantId, // ✅ ADD THIS
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
