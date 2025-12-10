import { prisma } from "../../libs/prisma.ts";

export async function deleteAccount(token: string, role: string) {
  const userRole = await prisma.userRole.findUnique({
    where: { token },
  });

  if (!userRole) {
    throw new Error("Invalid token or role");
  }

  if (userRole.role !== role) {
    throw new Error("Role mismatch");
  }

  const userId = userRole.userId;

  await prisma.otp.deleteMany({
    where: { userId },
  });

  await prisma.passwordReset.deleteMany({
    where: { userId },
  });

  await prisma.users.delete({
    where: { id: userId },
  });

  return { message: "Account deleted permanently" };
};