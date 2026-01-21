import { prisma } from "../../libs/prisma.ts";
import type { Role } from "@prisma/client";

export async function deleteAccount(userId: number, role: Role) {
  const userRole = await prisma.userRole.findFirst({
    where: {
      userId,
      role,
      isActive: true,
    },
  });

  if (!userRole) {
    throw new Error("Role mismatch or role not found for this user");
  }

  await prisma.otp.deleteMany({ where: { userId } });
  await prisma.passwordReset.deleteMany({ where: { userId } });

  await prisma.userRole.deleteMany({ where: { userId } });

  await prisma.users.delete({ where: { id: userId } });

  return { message: "Account deleted permanently" };
};
