import { Role } from "@prisma/client";
import type { DashboardOverviewResponse } from "../../shared/index.ts";
import prisma from "../../libs/prisma.ts";

export async function getDashboardOverview(): Promise<DashboardOverviewResponse> {
  try {
    const roleCounts = await prisma.userRole.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
      where: {
        isActive: true,
      },
    });

    const users = {
      admins: 0,
      chefs: 0,
      orderTakers: 0,
      shopOwners: 0,
    };

    for (const item of roleCounts) {
      switch (item.role) {
        case Role.Admin:
          users.admins = item._count.role;
          break;
        case Role.Chef:
          users.chefs = item._count.role;
          break;
        case Role.Order_Taker:
          users.orderTakers = item._count.role;
          break;
        case Role.Shop_Owner:
          users.shopOwners = item._count.role;
          break;
      }
    }

    const totalRestaurants = await prisma.restaurant.count({
      where: { isActive: true },
    });

    const totalUsers = await prisma.users.count({
      where: { isActive: true },
    });

    return {
      users,
      totalRestaurants,
      totalUsers,
    };
  } catch (error: any) {
    throw {
      statusCode: 500,
      message: "Failed to fetch dashboard overview",
    };
  }
}
