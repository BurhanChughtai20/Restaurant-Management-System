import bcrypt from "bcrypt";
import { redisClient } from "../../libs/redis.ts";
import { sendOtpEmail } from "../../libs/mailer.ts";

const OTP_EXPIRATION_SECONDS = 30;

export async function signup({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const key = `signup:${email}:${role}`;

  const exists = await redisClient.exists(key);
  if (exists) {
    throw new Error(
      "User already exists or pending verification for this role"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpExpiresAt = Date.now() + OTP_EXPIRATION_SECONDS * 1000;

  console.log(
    `[DEBUG SIGNUP] Generated OTP: ${otp} for email: ${email}, role: ${role}`
  );
  console.log(`[DEBUG SIGNUP] Redis key: ${key}`);
  console.log(
    `[DEBUG SIGNUP] OTP expires at: ${new Date(otpExpiresAt).toISOString()}`
  );

  // Store as JSON string in Redis (not as hash)
  const signupData = {
    name,
    email,
    password: hashedPassword,
    role,
    otp,
    otpExpiresAt: otpExpiresAt.toString(),
  };

  await redisClient.setEx(
    key,
    OTP_EXPIRATION_SECONDS,
    JSON.stringify(signupData)
  );

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    await redisClient.del(key);
    throw new Error("Failed to send OTP email. Please try again.");
  }

  return {
    message: `User created successfully. OTP sent to your email. OTP expires in ${OTP_EXPIRATION_SECONDS} seconds.`,
  };
}
