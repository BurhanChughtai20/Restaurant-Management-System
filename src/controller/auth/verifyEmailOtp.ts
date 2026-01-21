import { Role } from "@prisma/client";
import { redisClient } from "../../libs/redis.ts";
import prisma from "../../libs/prisma.ts";
import { ApiError } from "../../utils/ApiError.ts";
import { generateToken } from "../../utils/jwtToken.ts";

export async function verifyEmailOtp({
  email,
  otp,
  role,
}: {
  email: string;
  otp: string;
  role: Role;
}) {
  const redisKey = `signup:${email}:${role}`;
  const userDataRaw = await redisClient.hGetAll(redisKey);

  if (!userDataRaw || Object.keys(userDataRaw).length === 0) {
    throw new Error("OTP expired or user not found");
  }

  const requiredFields: (keyof typeof userDataRaw)[] = [
    "name",
    "email",
    "password",
    "role",
    "otp",
    "otpExpiresAt",
  ];

  for (const field of requiredFields) {
    if (!userDataRaw[field]) throw new Error(`Required field missing: ${field}`);
  }

  const name = userDataRaw.name!;
  const password = userDataRaw.password!;
  const storedOtp = userDataRaw.otp!;
  const otpExpiresAt = userDataRaw.otpExpiresAt!;

  if (storedOtp !== otp) throw new Error("Invalid OTP");

  const otpExpireTime = parseInt(otpExpiresAt, 10);
  if (isNaN(otpExpireTime) || otpExpireTime < Date.now()) throw new Error("OTP expired");

  const existingUser = await prisma.users.findFirst({ where: { email } });
  if (existingUser) throw new ApiError(409, "User already exists");

  const result = await prisma.$transaction(async (tx) => {
    let restaurantId: number | undefined;

    if (role === "Admin") {
      const restaurant = await tx.restaurant.create({
        data: {
          name: `${name}'s Restaurant`,
          slug: `${email.split("@")[0]}-${Date.now()}`,
        },
      });
      restaurantId = restaurant.id;
    }

    const user = await tx.users.create({
      data: {
        name,
        email,
        password,
        isEmailVerified: true,
        ...(restaurantId ? { restaurantId } : {}),
      },
    });

    const token = generateToken(user.id, role, "12h");

    const userRole = await tx.userRole.create({
      data: { userId: user.id, role, token, isActive: true },
    });

    return { user, userRole, token };
  });

  await redisClient.del(redisKey);

  return {
    message: "Email verified successfully",
    token: result.token,
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.userRole.role,
      restaurantId: result.user.restaurantId,
      isEmailVerified: result.user.isEmailVerified,
    },
  };
}
