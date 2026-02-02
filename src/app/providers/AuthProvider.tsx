"use client";

import React, { useEffect } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { restoreAuth } from "@/app/store/slices/authSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}
export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(restoreAuth());
  }, [ dispatch ]); 

  return <>{children}</>;
}
