import React, { JSX } from "react";

type DynamicContentProps = {
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
};

const baseStyles: Record<string, string> = {
  h1: "text-3xl md:text-4xl font-bold leading-tight",
  h2: "text-2xl md:text-3xl font-semibold leading-snug",
  h3: "text-xl md:text-2xl font-semibold",
  h4: "text-lg md:text-xl font-medium",
  h5: "text-base md:text-lg font-medium",
  h6: "text-sm md:text-base font-medium",
  p: "text-sm md:text-base leading-relaxed text-gray-700",
  span: "text-sm text-gray-600",
};

const DynamicContent: React.FC<DynamicContentProps> = ({
  as = "p",
  children,
  className = "",
}) => {
  const Component = as;

  return (
    <Component className={`${baseStyles[as] ?? ""} ${className}`}>
      {children}
    </Component>
  );
};

export default DynamicContent;
