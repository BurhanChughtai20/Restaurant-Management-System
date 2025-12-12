import prisma from "../../libs/prisma.ts";

interface PaginateParams {
  page: number;
  limit: number;
}

export async function paginateMenuItems({ page, limit }: PaginateParams) {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.menuItem.findMany({
      skip,
      take: limit,
      orderBy: { id: "desc" },
    }),

    prisma.menuItem.count(),
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
