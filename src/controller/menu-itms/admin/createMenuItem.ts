import prisma from "../../../libs/prisma.ts";
import type { MenuItemParams } from "../../../shared/index.ts";
import { generateSKU } from "../../../utils/generateSKU.ts";

export async function CreateMenuItem({
  name,
  price,
  description,
  restaurantId,
}: MenuItemParams) {
  if (!name || !price) {
    throw new Error("Name and price are required");
  }

  const sku = generateSKU(name);

  const newMenuItem = await prisma.menuItem.create({
    data: {
      name: name.trim(),
      price,
      description: description ?? null,
      sku,
      restaurant: {
        connect: { id: restaurantId },
      },
    },
  });

  return newMenuItem;
}

