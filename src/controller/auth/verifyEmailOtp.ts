import { Role } from "@prisma/client";
import { redisClient } from "../../libs/redis.ts";
import prisma from "../../libs/prisma.ts";
import { ApiError } from "../../utils/ApiError.ts";
import { generateToken } from "../../utils/jwtToken.ts";

interface UserData {
  name: string;
  email: string;
  password: string;
  role: string;
  otp: string;
  otpExpiresAt: string;
  restaurantData?: string | undefined;
}

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

  // Parse Redis data safely
  const userData: UserData = {
    name: userDataRaw.name!,
    email: userDataRaw.email!,
    password: userDataRaw.password!,
    role: userDataRaw.role!,
    otp: userDataRaw.otp!,
    otpExpiresAt: userDataRaw.otpExpiresAt!,
    restaurantData: userDataRaw.restaurantData || undefined,
  };

  // Validate required fields
  if (!userData.name || !userData.email || !userData.password || !userData.role) {
    await redisClient.del(redisKey);
    throw new Error("Required user data is missing");
  }

  if (userData.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  const otpExpiresAt = parseInt(userData.otpExpiresAt);
  if (isNaN(otpExpiresAt) || otpExpiresAt < Date.now()) {
    await redisClient.del(redisKey);
    throw new Error("OTP expired");
  }

  const existingUser = await prisma.users.findFirst({
    where: { email: userData.email },
  });

  if (existingUser) {
    await redisClient.del(redisKey);
    throw new ApiError(409, "User already exists");
  }

  // **SOLUTION: Dynamic data object - no undefined fields**
  const result = await prisma.$transaction(async (tx) => {
    let restaurantId: number | undefined;

    if (userData.role === 'Admin') {
      const restaurantData = userData.restaurantData 
        ? JSON.parse(userData.restaurantData)
        : { name: `${userData.name}'s Restaurant`, slug: `admin-${Date.now()}` };

      const restaurant = await tx.restaurant.create({
        data: {
          name: restaurantData.name as string,
          slug: restaurantData.slug as string,
        },
      });
      restaurantId = restaurant.id;
    }

    // **DYNAMIC CREATE DATA - omits restaurantId if undefined**
    const createData: any = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      isEmailVerified: true,
    };
    
    if (restaurantId !== undefined) {
      createData.restaurantId = restaurantId;
    }

    const user = await tx.users.create({
      data: createData,  // ✅ No undefined values
    });

    const token = generateToken(user.id, userData.role as Role, "12h");

    const userRole = await tx.userRole.create({
      data: {
        userId: user.id,
        role: userData.role as Role,
        token,
        isActive: true,
      },
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
