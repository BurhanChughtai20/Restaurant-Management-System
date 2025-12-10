import { redisClient } from "../../libs/redis.ts";
import { sendOtpEmail } from "../../libs/mailer.ts";
import { generateOtp } from "../../libs/generateOtp.ts";
import { hashPassword } from "../../libs/hashPassword.ts";

const OTP_EXPIRATION_SECONDS = 30;
const OtpExipres= Date.now() + OTP_EXPIRATION_SECONDS * 1000; 
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
    throw new Error("User already exists or pending verification for this role");
  }

  const hashedPassword = await hashPassword(password);
  const otp = generateOtp();
  const otpExpiresAt = OtpExipres;

  await redisClient.hSet(key, {
    name: name,
    email: email,
    password: hashedPassword,
    role: role,
    otp: otp,
    otpExpiresAt: otpExpiresAt,
  });

  await redisClient.expire(key, OTP_EXPIRATION_SECONDS);

  try {
    await sendOtpEmail(email, otp);
  } catch (error) {
    await redisClient.del(key);
    throw new Error("Failed to send OTP email. Please try again.");
  }

  return {
    message: `User created successfully. OTP sent to your email. Expires in ${OTP_EXPIRATION_SECONDS} sec.`,
  };
}