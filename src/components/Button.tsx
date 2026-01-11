import React from 'react';
import { Button } from 'antd';

// --- Dynamic Tailwind Classes ---
const classes = {
  gradientButton: "bg-gradient-to-b from-black via-gray-900 to-black text-white border-none flex items-center justify-center gap-2",
  defaultButton: "flex items-center justify-center gap-2",
};

export type ButtonComProps = {
  text: string;
  link?: string;
  onClick?: () => void;
  className?: string;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  color?: string; 
  disabled?: boolean;
  gradient?: boolean;
  icon?: React.ReactNode; // New Prop
  iconPosition?: 'left' | 'right'; // New Prop
};

const ButtonCom: React.FC<ButtonComProps> = ({
  text,
  link,
  onClick,
  className = '',
  type = 'primary',
  color,
  disabled = false,
  gradient = false,
  icon,
  iconPosition = 'left',
}) => {
  // Tailwind gradient class
  const gradientClass = gradient
    ? classes.gradientButton
    : classes.defaultButton;

  return (
    <Button
      type={type}
      href={link}
      onClick={onClick}
      disabled={disabled}
      className={`${gradientClass} ${className}`}
      style={
        !gradient && color
          ? { backgroundColor: color, borderColor: color, color: '#fff' }
          : undefined
      }
    >
      {icon && iconPosition === 'left' && icon}
      <span>{text}</span>
      {icon && iconPosition === 'right' && icon}
    </Button>
  );
};

export default ButtonCom;
