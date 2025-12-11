import prisma from "../../../libs/prisma.ts";

 
export async function getAllOrderTakers() {
  try {
    const orderTakers = await prisma.users.findMany({
      where: { userRoles: { some: { role: "Order_Taker" } } },
      select: { id: true, name: true, email: true, createdAt: true, isEmailVerified: true },
    });
    return orderTakers;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch order takers");
  }
}
