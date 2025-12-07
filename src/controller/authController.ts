import { prisma } from "../libs/prisma.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

const OTP_EXPIRATION_MINUTES = 10;

export async function signup({ email, password }: { email: string; password: string }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: { email, password: hashedPassword },
  });

  // Generate OTP for email verification
  const otpCode = randomBytes(3).toString("hex"); // 6-char OTP
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

  await prisma.otp.create({
    data: {
      userId: user.id,
      code: otpCode,
      type: "EMAIL_VERIFY",
      expiresAt,
    },
  });

  // TODO: send OTP via email

  return { message: "User created. Check your email for verification OTP." };
}

export async function login({ email, password }: { email: string; password: string }) {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  if (!user.isEmailVerified) throw new Error("Email not verified");

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
  return token;
}

export async function verifyEmailOtp({ email, otp }: { email: string; otp: string }) {
  const user = await prisma.users.findUnique({ where: { email }, include: { otps: true } });
  if (!user) throw new Error("User not found");

  const validOtp = user.otps.find(
    (o) => o.code === otp && o.type === "EMAIL_VERIFY" && o.expiresAt > new Date()
  );

  if (!validOtp) throw new Error("Invalid or expired OTP");

  await prisma.users.update({ where: { id: user.id }, data: { isEmailVerified: true } });
  await prisma.otp.delete({ where: { id: validOtp.id } });

  return { message: "Email verified successfully" };
}
