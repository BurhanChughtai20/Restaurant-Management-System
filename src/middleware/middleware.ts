import { AUTH_ROUTES, DASHBOARD_ROUTES } from "@/config/routes";
import { getToken } from "@/lib/tokenStore";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = getToken();
  const { pathname } = req.nextUrl;

  const authPaths = Object.values(AUTH_ROUTES) as string[];
  const dashboardPaths = Object.values(DASHBOARD_ROUTES) as string[];

  if (authPaths.includes(pathname) && token) {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTES.dashboard, req.url));
  }

  if (dashboardPaths.some((path) => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL(AUTH_ROUTES.login, req.url));
  }

  return NextResponse.next();
}
