import prisma from "../../libs/prisma.ts";

interface SearchMenuItemsParams {
  search?: string;
  page: number;
  limit: number;
  isActive?: boolean | undefined;
}

export async function searchMenuItems({
  search,
  page,
  limit,
  isActive,
}: SearchMenuItemsParams) {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const [items, total] = await Promise.all([
    prisma.menuItem.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "desc" },
    }),

    prisma.menuItem.count({
      where,
    }),
  ]);

  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
