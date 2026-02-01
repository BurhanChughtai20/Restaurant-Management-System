import { prisma } from "../../libs/prisma.ts";
import type { Role } from "@prisma/client";

export async function deleteAccount(userId: number, role: Role) {
  // 1️⃣ Fetch all active roles for this user
  const userRoles = await prisma.userRole.findMany({
    where: { userId, isActive: true },
  });

  if (!userRoles || userRoles.length === 0) {
    throw new Error("User does not have any active roles");
  }

  const matchedRole = userRoles.find(
    (r) => r.role.toLowerCase() === role.toLowerCase()
  );

  if (!matchedRole) {
    throw new Error("Role mismatch or role not found for this user");
  }

  await prisma.$transaction([
    prisma.otp.deleteMany({ where: { userId } }),
    prisma.passwordReset.deleteMany({ where: { userId } }),
    prisma.userRole.deleteMany({ where: { userId } }),
    prisma.users.delete({ where: { id: userId } }),
  ]);

  return { message: `User account with role ${matchedRole.role} deleted permanently` };
};
