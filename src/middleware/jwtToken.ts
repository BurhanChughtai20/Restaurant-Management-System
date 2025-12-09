import "dotenv/config";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

export function generateToken(
  userId: number,
  role: string,
  expiresIn: string | number = "12h"
): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not defined in .env");

  const payload = { userId, role };

  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}
export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not defined in .env");

  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
