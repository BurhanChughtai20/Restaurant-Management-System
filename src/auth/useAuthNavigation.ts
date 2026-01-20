// src/auth/useAuthNavigation.ts
"use client";
import { useNavigation } from "@/lib/useNavigation";
import { AUTH_ROUTES } from "@/config/routes";

export const useAuthNavigation = () => useNavigation(AUTH_ROUTES);