// src/lib/useNavigation.ts
"use client";

import { useRouter } from "next/navigation";

type RouteMap = Record<string, string>; // all route values are strings

export const useNavigation = <T extends RouteMap>(routes: T) => {
  const router = useRouter();

  const goTo = (route: keyof T) => {
    const path = routes[route] as string; 
    if (!path) console.warn(`[Navigation Warning] Route "${String(route)}" does not exist.`);
    router.push(path);
  };

  const replaceWith = (route: keyof T) => {
    const path = routes[route] as string; 
    if (!path) console.warn(`[Navigation Warning] Route "${String(route)}" does not exist.`);
    router.replace(path);
  };

  return { goTo, replaceWith };
};
