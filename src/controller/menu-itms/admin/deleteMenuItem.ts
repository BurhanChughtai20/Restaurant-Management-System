import prisma from "../../../libs/prisma.ts";
interface DeleteMenuItemParams {
  id: number;
};
export async function deleteMenuItem({ id }: DeleteMenuItemParams) {
  if (!id) throw new Error("Menu item ID is required");

  const existingItem = await prisma.menuItem.findUnique({ where: { id } });
  if (!existingItem) throw new Error("Menu item not found");

  await prisma.menuItem.delete({ where: { id } });

  return { message: "Menu item deleted successfully" };
}
