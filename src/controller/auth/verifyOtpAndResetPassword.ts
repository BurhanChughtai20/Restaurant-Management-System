import { redisClient } from "../../libs/redis.ts";
import prisma from "../../libs/prisma.ts";
import { ApiError } from "../../utils/ApiError.ts";
import { hashPassword } from "../../libs/hashPassword.ts";
export async function verifyOtpAndResetPassword({
  otp,
  password,
}: {
  otp: string;
  password: string;
}) {
  const keys = await redisClient.keys("password-reset:*");
  let matchedKey: string | null = null;
  let otpData: Record<string, string> | null = null;

  for (const key of keys) {
    const storedOtp = await redisClient.hGet(key, "otp");
    if (storedOtp === otp) {
      matchedKey = key;
      otpData = await redisClient.hGetAll(key); // get full hash row
      break;
    }
  }

  if (!matchedKey || !otpData) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  if (otpData.used !== undefined && otpData.used === "true") {
    throw new ApiError(400, "OTP already used");
  }

  if (!otpData.expiresAt) {
    throw new ApiError(400, "OTP expired");
  }

  if (parseInt(otpData.expiresAt) < Date.now()) {
    await redisClient.del(matchedKey);
    throw new ApiError(400, "OTP expired");
  }

  if (!otpData.userId) {
    throw new ApiError(400, "Invalid OTP data: missing userId");
  }

  const hashedPassword = await hashPassword(password);

  await prisma.users.update({
    where: { id: parseInt(otpData.userId) },
    data: { password: hashedPassword },
  });

  await redisClient.del(matchedKey);

  return { message: "Password reset successful" };
}
