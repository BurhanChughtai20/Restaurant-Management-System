// src/auth/types.ts

import { AUTH_ROUTES } from "./routes";

export type AuthRouteKey = keyof typeof AUTH_ROUTES;
export type AuthRouteValue = (typeof AUTH_ROUTES)[AuthRouteKey];
