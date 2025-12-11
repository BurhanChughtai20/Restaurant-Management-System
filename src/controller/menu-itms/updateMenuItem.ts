import { prisma } from "../../libs/prisma.ts";

interface UpdateMenuItemParams {
  id: number;
  name?: string;
  price?: number;
  description?: string;
}

export async function updateMenuItem({ id, name, price, description }: UpdateMenuItemParams) {
  if (!id) throw new Error("Menu item ID is required");

  const existingItem = await prisma.menuItem.findUnique({ where: { id } });
  if (!existingItem) throw new Error("Menu item not found");

  const updatedItem = await prisma.menuItem.update({
    where: { id },
    data: {
      name: name ?? existingItem.name,
      price: price ?? existingItem.price,
      description: description ?? existingItem.description,
    },
  });

  return updatedItem;
}
