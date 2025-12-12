import prisma from "../../../libs/prisma.ts";

interface PaginateParams {
  page: number;
  limit: number;
}

export async function paginateChefs({ page, limit }: PaginateParams) {
  const skip = (page - 1) * limit;

  const [chefs, total] = await Promise.all([
    prisma.chefConnection.findMany({
      skip,
      take: limit,
      orderBy: { id: "desc" },
      include: { chef: true },
    }),

    prisma.chefConnection.count(),
  ]);

  return {
    data: chefs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
