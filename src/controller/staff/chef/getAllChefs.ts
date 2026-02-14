import prisma from "../../../libs/prisma.ts";
import type {
  Chef,
  GetAllChefsInput,
  PaginatedChefs,
} from "../../../shared/interfaces/chef.interface.ts";

export async function getAllChefs({
  restaurantId,
  limit = 10,
  cursorId,
}: GetAllChefsInput): Promise<PaginatedChefs> {
  try {
    const chefsRaw = await prisma.users.findMany({
      where: {
        restaurantId,
        userRoles: { some: { role: "Chef", isActive: true } },
      },
      take: limit,
      ...(cursorId
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
        chefConnection: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            chefId: true,
            isActive: true,
            fromTime: true,
            toTime: true,
            createdAt: true,
          },
        },
      },
    });

    const chefs: Chef[] = chefsRaw.map((chef) => ({
      id: chef.id,
      name: chef.name.trim(),
      email: chef.email,
      restaurantId: chef.restaurantId,
      isEmailVerified: chef.isEmailVerified,
      createdAt: chef.createdAt,
      chefConnection: chef.chefConnection[0] ?? null,
    }));

    const nextCursor = chefs.length === limit
  ? chefs[chefs.length - 1]?.id ?? null
  : null;


    return {
      data: chefs,
      nextCursor,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch chefs");
  }
}
