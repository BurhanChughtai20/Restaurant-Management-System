"use client";

import { useEffect } from "react";
import Link from "next/link";

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "flex flex-col items-center justify-center min-h-screen px-4",
  title: "text-2xl font-bold text-gray-900 mb-4",
  message: "text-gray-600 mb-8 text-center max-w-md",
  button: "bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors",
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Something went wrong!</h2>
      <p className={classes.message}>
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex gap-4">
        <button onClick={reset} className={classes.button}>
          Try again
        </button>
        <Link href="/" className={classes.button}>
          Go home
        </Link>
      </div>
    </div>
  );
}
