import prisma from "../../../libs/prisma.ts";

interface DeleteMenuItemParams {
  id: number;
  restaurantId: number;  
}

export async function deleteMenuItem({
  id,
  restaurantId,
}: DeleteMenuItemParams) {
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

  await prisma.menuItem.delete({
    where: { id },
  });

  return { message: "Menu item deleted successfully" };
}
