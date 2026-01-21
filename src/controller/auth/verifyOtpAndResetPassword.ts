import { redisClient } from "../../libs/redis.ts";
import prisma from "../../libs/prisma.ts";
import { ApiError } from "../../utils/ApiError.ts";
import { hashPassword } from "../../libs/hashPassword.ts";
import { OtpData } from "../../shared/index.ts";
async function findOtpInRedis(otp: string): Promise<{ key: string; data: OtpData }> {
  const key = `password-reset:${otp}`;
  const dataRaw = await redisClient.hGetAll(key);

  if (!dataRaw || Object.keys(dataRaw).length === 0) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Hash-map style validation
  const requiredFields: (keyof OtpData)[] = ["otp", "userId", "expiresAt"];
  for (const field of requiredFields) {
    if (!dataRaw[field]) {
      throw new ApiError(400, `Invalid OTP data: missing ${field}`);
    }
  }

  const data: OtpData = {
    otp: dataRaw.otp!,
    userId: dataRaw.userId!,
    expiresAt: dataRaw.expiresAt!,
  };

  return { key, data };
}

function validateOtpData(otpData: OtpData) {
  const validators: Record<string, () => void> = {
    userId: () => {
      if (!otpData.userId) throw new ApiError(400, "Invalid OTP data: missing userId");
    },
    used: () => {
      if (otpData.used === "true") throw new ApiError(400, "OTP already used");
    },
    expiresAt: () => {
      if (!otpData.expiresAt || parseInt(otpData.expiresAt, 10) < Date.now())
        throw new ApiError(400, "OTP expired");
    },
  };

  for (const key in validators) {
    validators[key]?.();

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
    where: { id: parseInt(otpData.userId, 10) },
    data: { password: hashedPassword },
  });

  await redisClient.del(matchedKey);

  return { message: "Password reset successful" };
}
