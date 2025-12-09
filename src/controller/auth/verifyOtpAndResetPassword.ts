import { redisClient } from "../../libs/redis.ts";
import prisma from "../../libs/prisma.ts";
import bcrypt from "bcryptjs";
import { ApiError } from "../../utils/ApiError.ts";

export async function verifyOtpAndResetPassword({
  otp,
  newPassword,
}: {
  otp: string;
  newPassword: string;
}) {
  const keys = await redisClient.keys("password-reset:*");
  let matchedKey: string | null = null;
  let otpData: any = null;

  for (const key of keys) {
    const data = await redisClient.hGet(key, otp);
    if (data) {
      matchedKey = key;
      otpData = JSON.parse(data);
      break;
    }
  }

  if (!matchedKey || !otpData) throw new ApiError(400, "Invalid or expired OTP");
  if (otpData.used) throw new ApiError(400, "OTP already used");
  if (otpData.expiresAt < Date.now()) {
    await redisClient.hDel(matchedKey, otp);
    throw new ApiError(400, "OTP expired");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.users.update({
    where: { id: otpData.userId },
    data: { password: hashedPassword },
  });
  await redisClient.hDel(matchedKey, otp);

  return { message: "Password reset successful" };
}
