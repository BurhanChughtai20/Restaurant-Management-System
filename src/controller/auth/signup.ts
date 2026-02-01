import { redisClient } from "../../libs/redis.ts";
import { sendOtpEmail } from "../../libs/mailer.ts";
import { generateOtp } from "../../libs/generateOtp.ts";
import { hashPassword } from "../../libs/hashPassword.ts";
import type { SignupBody } from "../../shared/index.ts";
import prisma from "../../libs/prisma.ts";

const OTP_EXPIRATION_SECONDS = 300;

export async function signup({ name, email, password, role, desiredRestaurantName }: SignupBody) {
  const key = `signup:${email}:${role.toString()}`;

  const existingUser = await prisma.users.findUnique({ where: { email } });
  if (existingUser) throw new Error("User with this email already exists");

  const exists = await redisClient.exists(key);
  if (exists) throw new Error("User already requested signup. Please verify your email first.");

  const hashedPassword = await hashPassword(password);
  const otp = generateOtp();
  const otpExpiresAt = Date.now() + OTP_EXPIRATION_SECONDS * 1000;

  await redisClient.hSet(key, {
    name,
    email,
    password: hashedPassword,
    role: role.toString(),
    otp,
    otpExpiresAt: otpExpiresAt.toString(),
    ...(role !== "Admin" && desiredRestaurantName ? { desiredRestaurantName } : {}),
  });

  await redisClient.expire(key, OTP_EXPIRATION_SECONDS);

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    await redisClient.del(key);
    throw new Error("Failed to send OTP email");
  }

  return { message: "OTP sent successfully" };
}
