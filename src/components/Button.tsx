"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { ReactNode } from "react"

interface ButtonWithIconProps extends ButtonProps {
  icon: ReactNode
  text: string
  iconPosition?: "left" | "right"
  appearance?: "primary" | "default"
}
export const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  icon,
  text,
  iconPosition = "left",
  appearance,
  size = "default",
  variant = "default",
  className,
  ...props
}) => {
  const resolvedVariant = appearance === "primary" ? "default" : appearance === "default" ? "outline" : variant
  const content = (
    <span className="inline-flex items-center gap-2">
      {iconPosition === "left" ? (
        <>
          {icon}
          {text}
        </>
      ) : (
        <>
          {text}
          {icon}
        </>
      )}
    </span>
  )
  return (
    <Button size={size} variant={resolvedVariant} className={className} {...props}>
      {content}
    </Button>
  )
}
