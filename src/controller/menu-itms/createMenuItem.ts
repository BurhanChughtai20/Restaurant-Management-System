import { prisma } from "../../libs/prisma.ts";
import { generateSKU } from "../../utils/generateSKU.ts";

interface MenuItemParams {
  name: string;
  price: number;
  description?: string;
}

export async function CreateMenuItem({
  name,
  price,
  description,
}: MenuItemParams) {
  if (!name || !price) {
    throw new Error("Name and price are required");
  }

  const sku = generateSKU(name);

  const newMenuItem = await prisma.menuItem.create({
    data: {
      name,
      price,
      description: description ?? null,
      sku,
    },
  });

  return newMenuItem;
}
