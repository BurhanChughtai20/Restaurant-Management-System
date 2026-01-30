// verifyOtpUtils.ts
import { redisClient } from "../../libs/redis.ts";
import { ApiError } from "../../utils/ApiError.ts";
import type { OtpData, ResetPasswordBody, ResetPasswordResponse } from "../../shared/index.ts";
import { hashPassword } from "../../libs/hashPassword.ts";
import prisma from "../../libs/prisma.ts";

export async function findOtpInRedis(otp: string): Promise<{ key: string; data: OtpData }> {
  const key = `password-reset:${otp}`;
  const dataRaw = await redisClient.hGetAll(key);

  if (!dataRaw || Object.keys(dataRaw).length === 0) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  const data: OtpData = {
    otp: dataRaw.otp!,
    userId: dataRaw.userId!,
    expiresAt: dataRaw.expiresAt ?? null, // optional
    used: dataRaw.used ?? "false",
  };

  return { key, data };
}

export function validateOtpData(otpData: OtpData) {
  if (otpData.used === "true") throw new ApiError(400, "OTP already used");

  if (otpData.expiresAt && parseInt(otpData.expiresAt, 10) < Date.now()) {
    throw new ApiError(400, "OTP expired");
  }
}
export async function verifyOtpAndResetPassword({
  otp,
  password,
}: ResetPasswordBody): Promise<ResetPasswordResponse> {
  if (!otp) throw new ApiError(400, "OTP is required");
  if (!password) throw new ApiError(400, "Password is required");

  const { key: matchedKey, data: otpData } = await findOtpInRedis(otp);

  validateOtpData(otpData);

  const hashedPassword = await hashPassword(password);

  await prisma.users.update({
    where: { id: parseInt(otpData.userId, 10) },
    data: { password: hashedPassword },
  });

  // Mark OTP as used
  await redisClient.hSet(matchedKey, "used", "true");

  return { message: "Password reset successful" };
}