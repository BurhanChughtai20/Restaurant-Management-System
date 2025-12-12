import prisma from "../../../libs/prisma.ts";

interface PaginateParams {
  page: number;
  limit: number;
}

export async function paginateWaiters({ page, limit }: PaginateParams) {
  const skip = (page - 1) * limit;

  const [waiters, total] = await Promise.all([
    prisma.waiterConnection.findMany({
      skip,
      take: limit,
      orderBy: { id: "desc" },
      include: {
        waiter: true,
      },
    }),

    prisma.waiterConnection.count(),
  ]);

  return {
    data: waiters,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
