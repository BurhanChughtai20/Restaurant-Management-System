"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CardContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContainer = ({
  className,
  children,
  ...props
}: CardContainerProps) => (
  <div
    className={cn("perspective-[1000px]", className)}
    {...props}
  >
    {children}
  </div>
);

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBody = ({
  className,
  children,
  ...props
}: CardBodyProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -20;
    const rotateY = (x - 0.5) * 20;
    setTransform(
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    );
  };

  const handleMouseLeave = () => setTransform("");

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full transition-transform duration-200 ease-out [transform-style:preserve-3d]",
        className
      )}
      style={{ transform: transform || undefined }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  translateZ?: number | string;
}

export const CardItem = ({
  className,
  children,
  translateZ = 0,
  style,
  ...props
}: CardItemProps) => {
  const zValue =
    typeof translateZ === "number"
      ? `${translateZ}px`
      : /^\d+$/.test(String(translateZ))
        ? `${translateZ}px`
        : String(translateZ);
  return (
    <div
      className={cn("relative [transform-style:preserve-3d]", className)}
      style={{
        ...style,
        transform: `translateZ(${zValue})`,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
