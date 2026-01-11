"use client";

import React from "react";

// --- Dynamic Tailwind Classes ---
const classes = {
  provider: "",
};

/**
 * Client-side providers wrapper
 * Memoized to prevent unnecessary re-renders
 */
export const Providers = React.memo(({ children }: { children: React.ReactNode }) => {
  return <div className={classes.provider}>{children}</div>;
});

Providers.displayName = "Providers";

export default Providers;
