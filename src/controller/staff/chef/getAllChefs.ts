import prisma from "../../../libs/prisma.ts";
import type { GetAllChefsInput, PaginatedChefs } from "../../../shared/interfaces/chef.interface.ts";
export async function getAllChefs({
  restaurantId,
  limit = 10,
  cursorId,
}: GetAllChefsInput): Promise<PaginatedChefs> {
  const chefs = await prisma.users.findMany({
    where: {
      restaurantId,
      userRoles: { some: { role: "Chef", isActive: true } },
    },
    take: limit,
    ...(cursorId !== undefined
      ? { cursor: { id: cursorId }, skip: 1 }
      : {}),
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      restaurantId: true,
      createdAt: true,
      isEmailVerified: true,
      waiterConnection: {
        select: {
          id: true,
          orderTakerId: true,
          isActive: true,
          fromTime: true,
          toTime: true,
          createdAt: true,
        },
      },
    },
  });

  return {
    data: chefs,
    nextCursor: chefs[chefs.length - 1]?.id ?? null,
  };
}
