import prisma from "../../../libs/prisma.ts";

interface GetAllMenuItemsParams {
  restaurantId: number;
}

export async function getAllMenuItems({ restaurantId }: GetAllMenuItemsParams) {
  try {
    return await prisma.menuItem.findMany({
      where: {
        restaurantId,
      },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch menu items");
  }
}
