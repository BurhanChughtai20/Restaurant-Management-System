import { Role } from "@prisma/client";
import prisma from "./prisma.ts";

export async function getRestaurantIdForRole(
  role: Role,
  name: string,
  email: string,
  desiredRestaurantName?: string
): Promise<number> {
  if (role === "Admin") {
    // Admin → create new restaurant
    const restaurant = await prisma.restaurant.create({ 
      data: { 
        name: `${name}'s Restaurant`, 
        slug: `${email.split("@")[0]}-${Date.now()}` 
      } 
    });
    return restaurant.id;
  } else {
    // Order_Taker / Chef → use existing restaurant
    if (!desiredRestaurantName) {
      throw new Error(`Restaurant name required for role ${role}`);
    }

    const restaurant = await prisma.restaurant.findFirst({ 
      where: { name: { equals: desiredRestaurantName, mode: "insensitive" } } 
    });

    if (!restaurant) {
      throw new Error(
        "Restaurant not found. Please provide a valid restaurant name created by an Admin."
      );
    }

    return restaurant.id;
  }
}
