import { Role } from "@prisma/client";
import { redisClient } from "../../libs/redis.ts";
import prisma from "../../libs/prisma.ts";
import { generateToken } from "../../utils/jwtToken.ts";

export async function verifyEmailOtp({
  email,
  otp,
  role,
}: {
  email: string;
  otp: string;
  role: Role;
}) {
  // 1️⃣ Fetch user data from Redis
  const redisKey = `signup:${email}:${role.toString()}`;
  const userData = await redisClient.hGetAll(redisKey);

  if (!userData || Object.keys(userData).length === 0) {
    throw new Error("OTP expired or user not found");
  }

  const { name, password, otp: storedOtp, otpExpiresAt, desiredRestaurantName } = userData;

  // 2️⃣ Validate required fields
  if (!name || !email || !password || !storedOtp || !otpExpiresAt) {
    throw new Error("Signup data incomplete");
  }

  if (storedOtp !== otp) throw new Error("Invalid OTP");
  if (parseInt(otpExpiresAt, 10) < Date.now()) throw new Error("OTP expired");

  // 3️⃣ Determine restaurantId with fast lookup
  const restaurantId = await (async (): Promise<number> => {
    const roleActions: Record<Role, () => Promise<number>> = {
      Admin: async () => {
        const restaurant = await prisma.restaurant.create({
          data: {
            name: `${name}'s Restaurant`,
            slug: `${email.split("@")[0]}-${Date.now()}`,
          },
        });
        return restaurant.id;
      },
      Order_Taker: async () => {
        if (!desiredRestaurantName) throw new Error("Restaurant name required for Order_Taker");
        const restaurant = await prisma.restaurant.findFirst({
          where: { name: desiredRestaurantName },
        });
        if (!restaurant) throw new Error("Restaurant not found");
        return restaurant.id;
      },
      Chef: async () => {
        if (!desiredRestaurantName) throw new Error("Restaurant name required for Chef");
        const restaurant = await prisma.restaurant.findFirst({
          where: { name: desiredRestaurantName },
        });
        if (!restaurant) throw new Error("Restaurant not found");
        return restaurant.id;
      },
      Shop_Owner: async () => {
        throw new Error("Shop_Owner signup not supported here");
      },
    };

    return roleActions[role]();
  })();

  // 4️⃣ Create user
  const user = await prisma.users.create({
    data: {
      name,
      email,
      password,
      isEmailVerified: true,
      restaurantId,
    },
  });

  // 5️⃣ Generate token & assign role
  const token = generateToken(user.id, role, "12h");

  const userRole = await prisma.userRole.create({
    data: { userId: user.id, role, token, isActive: true },
  });

  // 6️⃣ Cleanup Redis
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
