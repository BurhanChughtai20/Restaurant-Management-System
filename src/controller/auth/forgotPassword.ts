import { redisClient } from "../../libs/redis.ts";
import prisma from "../../libs/prisma.ts";
import { ApiError } from "../../utils/ApiError.ts";
import { sendOtpEmail } from "../../libs/mailer.ts";
import { generateOtp } from "../../libs/generateOtp.ts";

export async function forgotPassword({ email }: { email: string }) {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new ApiError(404, "User not found");

  const otp = generateOtp();
  const expiresAt = Date.now() + 2 * 60 * 1000;

  const redisKey = `password-reset:${user.id}`;

  await redisClient.hSet(redisKey, otp, JSON.stringify({
    otp,
    userId: user.id,
    createdAt: Date.now(),
    expiresAt,
    used: false
  }));

  await redisClient.expire(redisKey, 15 * 60);

  await sendOtpEmail(email, otp);

  return { message: "Password reset OTP sent to email" };
}
