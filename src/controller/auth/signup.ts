import { generateOtp } from "../../libs/generateOtp.ts";
import { getRestaurantIdForRole } from "../../libs/getRestaurantIdForRole.ts";
import { hashPassword } from "../../libs/hashPassword.ts";
import { sendOtpEmail } from "../../libs/mailer.ts";
import prisma from "../../libs/prisma.ts";
import { redisClient } from "../../libs/redis.ts";
import type { SignupBody } from "../../shared/index.ts";

const OTP_EXPIRATION_SECONDS = 300;

export async function signup({ name, email, password, role, desiredRestaurantName }: SignupBody) {
  const key = `signup:${email}:${role}`;

  const existingUser = await prisma.users.findUnique({ where: { email } });
  if (existingUser) throw new Error("User with this email already exists");

  const exists = await redisClient.exists(key);
  if (exists) throw new Error("User already requested signup. Please verify your email first.");

  // Validate restaurant if role requires it
  if (role !== "Admin") {
    if (!desiredRestaurantName) throw new Error("desiredRestaurantName is required for this role");
    await getRestaurantIdForRole(role, name, email, desiredRestaurantName);
  }

  const hashedPassword = await hashPassword(password);
  const otp = generateOtp();
  const otpExpiresAt = Date.now() + OTP_EXPIRATION_SECONDS * 1000;

  await redisClient.hSet(key, {
    name,
    email,
    password: hashedPassword,
    role,
    otp,
    otpExpiresAt: otpExpiresAt.toString(),
    ...(desiredRestaurantName ? { desiredRestaurantName } : {}),
  });

  await redisClient.expire(key, OTP_EXPIRATION_SECONDS);
  await sendOtpEmail(email, otp);

  return { message: "OTP sent successfully" };
}
