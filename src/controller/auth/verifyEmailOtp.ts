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
  try {
    const redisKey = `signup:${email}:${role}`;
    console.log(`[DEBUG] Looking for Redis key: ${redisKey}`);

    let data = await redisClient.get(redisKey);

    if (!data) {
      console.log(`[DEBUG] String not found, trying hash format...`);
      const hashData = await redisClient.hGetAll(redisKey);
      if (Object.keys(hashData).length > 0) {
        console.log(`[DEBUG] Hash found, converting to string...`);
        data = JSON.stringify(hashData);
      }
    }

    if (!data) {
      console.log(`[DEBUG] No data found in Redis for key: ${redisKey}`);
      // Clear any old data
      await redisClient.del(redisKey).catch(() => {});
      throw new Error("OTP expired or user not found");
    }

    console.log(`[DEBUG] Data found in Redis:`, data);
    const userData = JSON.parse(data);

    if (userData.otp !== otp) {
      console.log(
        `[DEBUG] OTP mismatch. Expected: ${userData.otp}, Got: ${otp}`
      );
      throw new Error("Invalid OTP");
    }

    if (userData.otpExpiresAt < Date.now()) {
      console.log(
        `[DEBUG] OTP expired. Expiry time: ${
          userData.otpExpiresAt
        }, Current time: ${Date.now()}`
      );
      await redisClient.del(redisKey);
      throw new Error("OTP expired");
    }

    const existingUser = await prisma.users.findFirst({
      where: { email: userData.email },
    });
    if (existingUser) {
      await redisClient.del(`signup:${email}:${userData.role}`);
      throw new ApiError(409, "User already exists");
    }

    const user = await prisma.users.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        isEmailVerified: true,
      },
    });

    const token = generateToken(user.id, userData.role, "12h");

    const userRole = await prisma.userRole.create({
      data: {
        userId: user.id,
        role: userData.role,
        token,
        isActive: true,
      },
    });

    await redisClient.del(`signup:${email}:${userData.role}`);

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
  } catch (error) {
    await redisClient.del(`signup:${email}`).catch(() => {});
    throw error;
  }
}
