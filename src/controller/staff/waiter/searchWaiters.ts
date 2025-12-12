import prisma from "../../../libs/prisma.ts";

interface SearchWaitersParams {
  search?: string;
  page: number;
  limit: number;
  isActive?: boolean | undefined;
}

export async function searchWaiters({
  search,
  page,
  limit,
  isActive,
}: SearchWaitersParams) {
  const skip = (page - 1) * limit;

  const where: any = {
    waiter: {},
  };

  if (search) {
    where.waiter = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const [waiters, total] = await Promise.all([
    prisma.waiterConnection.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "desc" },
      include: {
        waiter: true,
      },
    }),

    prisma.waiterConnection.count({ where }),
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
