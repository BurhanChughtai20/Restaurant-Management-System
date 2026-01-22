import bcrypt from "bcrypt";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);
export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 8) {
    throw new Error("Password does not meet minimum security requirements");
  }

  return bcrypt.hash(password, SALT_ROUNDS);
}
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
