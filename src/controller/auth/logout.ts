import { prisma } from "../../libs/prisma.ts";
import type { Role } from "@prisma/client";

export async function logout(userId: number, role: string) {
  // Clear the token for the specific role in UserRole table
  await prisma.userRole.updateMany({
    where: { userId, role: role as Role },
    data: { token: null, isActive: false },
  });

  return { message: "Logged out successfully" };
}
