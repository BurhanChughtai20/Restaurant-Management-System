import { prisma } from "../../libs/prisma.ts";
import { redisClient } from "../../libs/redis.ts";
import { getRestaurantIdForRole } from "../../libs/getRestaurantIdForRole.ts";
import { generateToken } from "../../utils/jwtToken.ts";
import type { UserData, VerifyEmailOtpParams, VerifyEmailOtpResponse } from "../../shared/index.ts";

export async function verifyEmailOtp({
  email,
  otp,
  role,
}: VerifyEmailOtpParams): Promise<VerifyEmailOtpResponse> {
  const redisKey = `signup:${email}:${role}`;
  const userDataRaw = await redisClient.hGetAll(redisKey);
  if (!userDataRaw || Object.keys(userDataRaw).length === 0) throw new Error("OTP expired or user not found");

  const userData: UserData = {
    name: userDataRaw.name ?? "",
    email: userDataRaw.email ?? "",
    password: userDataRaw.password ?? "",
    role,
    otp: userDataRaw.otp ?? "",
    otpExpiresAt: userDataRaw.otpExpiresAt ?? "",
    ...(userDataRaw.desiredRestaurantName ? { desiredRestaurantName: userDataRaw.desiredRestaurantName } : {}),
  };

  if (userData.otp !== otp) throw new Error("Invalid OTP");
  if (parseInt(userData.otpExpiresAt, 10) < Date.now()) throw new Error("OTP expired");

  let user = await prisma.users.findUnique({ where: { email } });

  if (!user) {
    // Assign restaurant ID
    const restaurantId = await getRestaurantIdForRole(role, userData.name, email, userData.desiredRestaurantName);

    user = await prisma.users.create({
      data: {
        name: userData.name,
        email,
        password: userData.password,
        restaurantId,
        isEmailVerified: true,
        isActive: true,
      },
    });
  } else {
    user = await prisma.users.update({
      where: { email },
      data: { isEmailVerified: true },
    });
  }

  const token = generateToken(user.id, role, "12h");

  const userRole = await prisma.userRole.upsert({
    where: { userId_role: { userId: user.id, role } },
    update: { token, isActive: true },
    create: { userId: user.id, role, token, isActive: true },
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
      restaurantId: user.restaurantId,
      restaurantName: (await prisma.restaurant.findUnique({ where: { id: user.restaurantId } }))?.name as string | null,
      isActive: userRole.isActive,
      isEmailVerified: user.isEmailVerified,
       createdAt: user.createdAt.toISOString(),
    },
  };
}
