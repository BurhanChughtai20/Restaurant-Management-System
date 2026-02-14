import type { Role } from "@prisma/client";

export interface SignupBody {
  name: string;
  email: string;
  password: string;
  role: Role;
  desiredRestaurantName?: string;
}

export interface LoginBody {
  email: string;
  password: string;
  role: Role;
}

export interface VerifyEmailBody {
  email: string;
  otp: string;
  role: Role;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  otp: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface DeleteAccountBody {
  role: Role;
}

export interface AuthTokenPayload {
  userId: string;
  role: Role;
}

export interface UserData {
  name: string;
  email: string;
  password: string;
  role: string;
  otp: string;
  otpExpiresAt: string;
  desiredRestaurantName?: string;
}


export interface OtpData {
  otp: string;
  userId: string;
  expiresAt?: string | null;
  used?: string;
}

export interface AuthenticatedUser {
  id: number;
  role: Role;
  name?: string;
  restaurantId?: number;
}



export interface VerifyEmailOtpParams {
  email: string;
  otp: string;
  role: Role;
}

type isActive= true | false;
export interface VerifyEmailOtpResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: Role;
    restaurantId: number;
    restaurantName?: string | null;
    isActive: isActive;
    isEmailVerified: boolean;
    createdAt?: string | null;
  };
}

export interface UserRoleCounts {
  admins: number;
  chefs: number;
  orderTakers: number;
  shopOwners: number;
}

export interface DashboardOverviewResponse {
  users: UserRoleCounts;
  totalRestaurants: number;
  totalUsers: number;
}
