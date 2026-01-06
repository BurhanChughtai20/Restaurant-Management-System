import React from 'react';
import { Button } from 'antd';

export type ButtonComProps = {
  text: string;
  link?: string;
  onClick?: () => void;
  className?: string;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  color?: string; // solid color fallback
  disabled?: boolean;
  gradient?: boolean; // new prop for gradient
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
}) => {
  // Tailwind gradient class
  const gradientClass = gradient
    ? 'bg-gradient-to-b from-black via-gray-900 to-black text-white border-none'
    : '';

  return (
    <Button
      type={type}
      href={link}
      onClick={onClick}
      disabled={disabled}
      className={`${gradientClass} ${className}`}
      style={
        // fallback to solid color if provided
        !gradient && color
          ? { backgroundColor: color, borderColor: color, color: '#fff' }
          : undefined
      }
    >
      {text}
    </Button>
  );
};

export default ButtonCom;
