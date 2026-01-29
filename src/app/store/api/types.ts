// ----------------- Enums -----------------
export enum Role {
  Admin = "Admin",
  Order_Taker = "Order_Taker",
  Shop_Owner = "Shop_Owner",
  Chef = "Chef",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PICKED = "PICKED",
  READY = "READY",
  COMPLETED = "COMPLETED",
}

// ----------------- Auth -----------------
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  restaurantId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: Role.Admin; // Only Admin can signup
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
  role?: Role;
}

export interface VerifyEmailResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  otp: string;
  password: string;
}

// Auth Redux State
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthCredentials {
  user: AuthUser;
  token: string;
}

// ----------------- Menu Items -----------------
export interface MenuItem {
  id: number;
  restaurantId: number;
  name: string;
  sku: string;
  price: number;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminMenuItemsResponse {
  data: MenuItem[];
  nextCursor: number | null;
}

export interface AdminMenuItemsRequest {
  cursor?: number;
}

export interface MenuItemBody {
  name: string;
  price: number;
  description?: string;
  sku?: string;
}

export interface UpdateMenuItemBody {
  name?: string;
  price?: number;
  description?: string;
  sku?: string;
  isActive?: boolean;
}

export interface MenuItemParams {
  name: string;
  price: number;
  description?: string;
  restaurantId: number;
  sku: string;
}

export interface UpdateMenuItemParams {
  id: number;
  restaurantId: number;
  name?: string;
  price?: number;
  description?: string;
  sku?: string;
  isActive?: boolean;
}

export interface DeleteMenuItemParams {
  id: number;
  restaurantId: number;
}

export interface DeleteMenuItemResponse {
  message: string;
  deletedItemId: number;
}

export interface GetAllMenuItemsParams {
  restaurantId: number;
  limit?: number;
  cursorId?: number;
}

export interface PaginatedMenuItems {
  data: MenuItem[];
  nextCursor: number | null;
}

export interface SearchMenuItemsParams {
  restaurantId: number;
  search?: string;
  page: number;
  limit: number;
  isActive?: boolean;
}

export interface PaginateParams {
  restaurantId: number;
  page: number;
  limit: number;
  cursorId?: number;
}

// ----------------- Order Taker / Chef -----------------
export interface WaiterConnection {
  id: number;
  orderTakerId: number;
  socketId?: string;
  sessionToken: string;
  isActive: boolean;
  fromTime?: string;
  toTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderTaker {
  id: number;
  restaurantId: number;
  name: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  waiterConnection?: WaiterConnection;
}

export interface ChefConnection {
  id: number;
  chefId: number;
  socketId?: string;
  sessionToken: string;
  isActive: boolean;
  fromTime?: string;
  toTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chef {
  id: number;
  restaurantId: number;
  name: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  chefConnection?: ChefConnection;
}

// ----------------- Orders -----------------
export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: number;
  restaurantId: number;
  orderTakerId?: number;
  chefId?: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  orderTaker?: OrderTaker;
  chef?: Chef;
}

// ----------------- Articles -----------------
export interface Article {
  id: number;
  restaurantId: number;
  title: string;
  description: string;
  image?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  publisherId: number;
}

// ----------------- WhatsApp Orders -----------------
export interface WhatsAppOrderItem {
  id: number;
  whatsappOrderId: number;
  menuItemId: number;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface WhatsAppOrder {
  id: number;
  restaurantId: number;
  phoneNumber: string;
  clientName?: string;
  address: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: WhatsAppOrderItem[];
}

// ----------------- Paginated Response -----------------
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ----------------- Filters / Stats -----------------
export interface SearchParams {
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface Stats {
  total: number;
  active: number;
  inactive: number;
}