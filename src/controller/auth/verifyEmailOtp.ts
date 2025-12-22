import { Role } from "@prisma/client";
import prisma from "../../libs/prisma.ts";
import { redisClient } from "../../libs/redis.ts";
import { generateToken } from "../../utils/jwtToken.ts";
import { ApiError } from "../../utils/ApiError.ts";

export async function verifyEmailOtp({
  email,
  otp,
  role,
}: {
  email: string;
  otp: string;
  role: string;
}) {
  const redisKey = `signup:${email}:${role}`;
  const userData = await redisClient.hGetAll(redisKey);

  if (!userData || Object.keys(userData).length === 0) {
    throw new Error("OTP expired or user not found");
  }

  if (userData.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  const otpExpiresAt = userData.otpExpiresAt;
  if (!otpExpiresAt || parseInt(otpExpiresAt) < Date.now()) {
    await redisClient.del(redisKey);
    throw new Error("OTP expired");
  }

  if (!userData.email) {
    throw new Error("Email is missing");
  }

  const existingUser = await prisma.users.findFirst({
    where: { email: userData.email },
  });

  if (existingUser) {
    await redisClient.del(redisKey);
    throw new ApiError(409, "User already exists");
  }
  if (!userData.email || !userData.name || !userData.password) {
    throw new Error("Required user data is missing");
  }

  const user = await prisma.users.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      isEmailVerified: true,
    },
  });

  const token = generateToken(user.id, userData.role as Role, "12h");

  const userRole = await prisma.userRole.create({
    data: {
      userId: user.id,
      role: userData.role as Role,
      token,
      isActive: true,
    },
  });

  await redisClient.del(redisKey);

  return {
    message: "Email verified successfully",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: userRole.role,
      isEmailVerified: user.isEmailVerified,
    },
  };
}
