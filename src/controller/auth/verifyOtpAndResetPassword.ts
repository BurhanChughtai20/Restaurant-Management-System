import { redisClient } from "../../libs/redis.ts";
import prisma from "../../libs/prisma.ts";
import { ApiError } from "../../utils/ApiError.ts";
import { hashPassword } from "../../libs/hashPassword.ts";

interface OtpData {
  otp: string;
  userId: string;
  expiresAt: string;
  used?: string;
}

async function findOtpInRedis(otp: string): Promise<{ key: string; data: OtpData }> {
  const keys = await redisClient.keys("password-reset:*");

  for (const key of keys) {
    const fields = await redisClient.hKeys(key);

    for (const field of fields) {
      const value = await redisClient.hGet(key, field);
      if (!value) continue;

      let data: OtpData;
      try {
        data = JSON.parse(value);
      } catch {
        continue;
      }

      if (data.otp === otp) {
        return { key, data };
      }
    }
  }

  throw new ApiError(400, "Invalid or expired OTP");
}

function validateOtpData(otpData: OtpData) {
  if (!otpData.userId) {
    throw new ApiError(400, "Invalid OTP data: missing userId");
  }

  if (otpData.used === "true") {
    throw new ApiError(400, "OTP already used");
  }

  if (!otpData.expiresAt || parseInt(otpData.expiresAt) < Date.now()) {
    throw new ApiError(400, "OTP expired");
  }
}

export async function verifyOtpAndResetPassword({
  otp,
  password,
}: {
  otp: string;
  password: string;
}) {
  if (!password || typeof password !== "string") {
    throw new ApiError(400, "Password is required");
  }

  const { key: matchedKey, data: otpData } = await findOtpInRedis(otp);

  validateOtpData(otpData);

  const hashedPassword = await hashPassword(password);

  await prisma.users.update({
    where: { id: parseInt(otpData.userId) },
    data: { password: hashedPassword },
  });

  await redisClient.del(matchedKey);

  return { message: "Password reset successful" };
}
