import prisma from "../../../libs/prisma.ts";

 
interface SearchChefParams {
  search?: string;
  page: number;
  limit: number;
  isActive?: boolean | undefined;
}

export async function searchChefs({
  search,
  page,
  limit,
  isActive,
}: SearchChefParams) {
  const skip = (page - 1) * limit;

  const where: any = {
    chef: {}   // Search within Users model (relation)
  };

  if (search) {
    where.chef = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const [chefs, total] = await Promise.all([
    prisma.chefConnection.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "desc" },
      include: { chef: true }, // 🔥 include user info
    }),

    prisma.chefConnection.count({ where }),
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
