import { Suspense, ReactNode } from "react";

// --- Dynamic Tailwind Classes ---
const classes = {
  loadingContainer: "flex items-center justify-center min-h-[200px]",
  spinner: "w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin",
};

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const SuspenseBoundary: React.FC<SuspenseBoundaryProps> = ({ 
  children, 
  fallback 
}) => {
  const defaultFallback = (
    <div className={classes.loadingContainer}>
      <div className={classes.spinner} />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

export default SuspenseBoundary;
