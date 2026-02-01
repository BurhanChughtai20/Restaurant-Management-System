import { Role } from "@prisma/client";
import { redisClient } from "../../libs/redis.ts";
import prisma from "../../libs/prisma.ts";
import { generateToken } from "../../utils/jwtToken.ts";
export async function verifyEmailOtp({ email, otp, role }: { email: string; otp: string; role: Role }) {
  const redisKey = `signup:${email}:${role.toString()}`;
  const userData = await redisClient.hGetAll(redisKey);

  if (!userData || Object.keys(userData).length === 0) throw new Error("OTP expired or user not found");

  const { name, password, otp: storedOtp, otpExpiresAt, desiredRestaurantName } = userData;

  if (!name || !email || !password || !storedOtp || !otpExpiresAt) throw new Error("Signup data incomplete");
  if (storedOtp !== otp) throw new Error("Invalid OTP");
  if (parseInt(otpExpiresAt, 10) < Date.now()) throw new Error("OTP expired");

  const restaurantId = await (async (): Promise<number> => {
    if (role === "Admin") {
      const restaurant = await prisma.restaurant.create({ data: { name: `${name}'s Restaurant`, slug: `${email.split("@")[0]}-${Date.now()}` } });
      return restaurant.id;
    } else {
      if (!desiredRestaurantName) throw new Error(`Restaurant name required for ${role}`);
      const restaurant = await prisma.restaurant.findFirst({ where: { name: desiredRestaurantName } });
      if (!restaurant) throw new Error("Restaurant not found");
      return restaurant.id;
    }
  })();

  let user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.users.create({ data: { name, email, password, isEmailVerified: true, restaurantId } });
  } else {
    user = await prisma.users.update({ where: { email }, data: { isEmailVerified: true, restaurantId } });
  }

  const token = generateToken(user.id, role, "12h");

  const userRole = await prisma.userRole.upsert({
    where: { userId_role: { userId: user.id, role } },
    update: { token, isActive: true },
    create: { userId: user.id, role, token, isActive: true },
  });

  await redisClient.del(redisKey);

  return {
    message: "Email verified successfully",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: userRole.role,
      restaurantId: user.restaurantId,
      isEmailVerified: user.isEmailVerified,
    },
  };
}
