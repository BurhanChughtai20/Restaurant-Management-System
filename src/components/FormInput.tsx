"use client";

import React from "react";
import { Label } from "./ui/label"; // Check your import path (usually ui/label)
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

const classes = {
  container: "flex flex-col space-y-2 w-full group/input",
  label: "text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  input: "h-10 w-full px-3 py-2 text-sm md:text-base", // Simplified as ui/input handles styling
};

// Update interface to include halfWidth
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  containerClassName?: string;
  halfWidth?: boolean; // Add this line
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  containerClassName,
  placeholder,
  type = "text",
  halfWidth, // Destructure this here to "catch" it
  ...props   // Now props ONLY contains valid input attributes
}) => {
  return (
    <div className={cn(classes.container, containerClassName)}>
      <Label htmlFor={id} className={classes.label}>
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...props} // halfWidth is no longer in here!
      />
    </div>
  );
};

export default FormInput;