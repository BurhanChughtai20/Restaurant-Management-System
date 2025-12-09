import { redisClient } from "../../libs/redis.ts";
import prisma from "../../libs/prisma.ts";
import crypto from "crypto";
import { ApiError } from "../../utils/ApiError.ts";
import { sendOtpEmail } from "../../libs/mailer.ts";

export async function forgotPassword({ email }: { email: string }) {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new ApiError(404, "User not found");

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

  // Redis key per user
  const redisKey = `password-reset:${user.id}`;

  // Store OTP in Redis hash (row-like)
  await redisClient.hSet(redisKey, otp, JSON.stringify({
    otp,
    userId: user.id,
    createdAt: Date.now(),
    expiresAt,
    used: false
  }));

  // Set TTL for cleanup
  await redisClient.expire(redisKey, 15 * 60); // 15 minutes

  // Send OTP using mailer helper
  await sendOtpEmail(email, otp);

  return { message: "Password reset OTP sent to email" };
}
