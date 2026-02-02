"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { ReactNode } from "react"

interface ButtonWithIconProps extends ButtonProps {
  icon: ReactNode
  text: string
}
export const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  icon,
  text,
  size = "default",
  variant = "default",
  className,
  ...props
}) => {
  return (
    <Button size={size} variant={variant} className={className} {...props}>
      <span className="inline-flex items-center gap-2">
        {icon}
        {text}
      </span>
    </Button>
  )
}
