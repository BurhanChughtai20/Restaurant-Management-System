/**
 * TypeScript types matching backend Prisma schema
 * Ensures type safety across the application
 */

export enum Role {
    Admin = 'Admin',
    Order_Taker = 'Order_Taker',
    Shop_Owner = 'Shop_Owner',
    Chef = 'Chef',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PICKED = 'PICKED',
    READY = 'READY',
    COMPLETED = 'COMPLETED',
}

export interface MenuItem {
    id: number;
    restaurantId: number;
    name: string;
    sku: string;
    price: number;
    description?: string;
    isActive: boolean;
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
