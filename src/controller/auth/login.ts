import { prisma } from "../../libs/prisma.ts";
import bcrypt from "bcrypt";
import { generateToken } from "../../middleware/jwtToken.ts";
import { ApiError } from "../../utils/ApiError.ts";

export async function login({
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role: "Admin" | "Order_Taker" | "Shop_Owner";
}) {
  try {
    const user = await prisma.users.findUnique({
      where: { email },
      include: {
        userRoles: {
          where: { role, isActive: false },
        },
      },
    });
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isEmailVerified) {
      throw new ApiError(
        403,
        "Email not verified. Please verify your email first."
      );
    }

    if (!user.userRoles || user.userRoles.length === 0) {
      throw new ApiError(403, `User does not have ${role} role`);
    }

    const userRole = user.userRoles[0];

    if (!userRole) {
      throw new ApiError(403, `User does not have ${role} role`);
    }

    const token = generateToken(user.id, role, "12h");

    await prisma.userRole.update({
      where: { id: userRole.id },
      data: { token, isActive: true },
    });

    return {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userRole.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    };
  } catch (error) {
    throw error;
  }
}
