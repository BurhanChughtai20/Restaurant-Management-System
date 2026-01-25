"use client";

import { Provider } from "react-redux";
import { store } from "@/app/store/store";
import { AuthProvider } from "./AuthProvider";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}