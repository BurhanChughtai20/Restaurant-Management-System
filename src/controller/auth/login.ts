import { prisma } from "../../libs/prisma.ts";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwtToken.ts";
import { ApiError } from "../../utils/ApiError.ts";
import { Role } from "@prisma/client";

export async function login({
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role: Role;
}) {
  const user = await prisma.users.findUnique({
    where: { email },
    include: { userRoles: true, restaurant: true },
  });

  if (!user) throw new ApiError(401, "Invalid email or password");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");

  if (!user.isEmailVerified)
    throw new ApiError(403, "Email not verified. Please verify your email first.");

  const userRole = user.userRoles.find((r) => r.role === role && r.isActive);
  if (!userRole)
    throw new ApiError(403, `User does not have ${role} role`);

  const token = generateToken(user.id, role, "12h");

  // Update token in DB
  await prisma.userRole.update({
    where: { id: userRole.id },
    data: { token, isActive: true },
  });

  return {
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: userRole.role,
      restaurantId: user.restaurantId,
      restaurantName: user.restaurant?.name,
      isActive: userRole.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    },
  };
}
