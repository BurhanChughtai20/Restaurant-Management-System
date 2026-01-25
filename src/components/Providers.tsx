"use client";

import React from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = React.memo(({ children }: ProvidersProps) => {
  return <>{children}</>;
});

Providers.displayName = "Providers";

export default Providers;