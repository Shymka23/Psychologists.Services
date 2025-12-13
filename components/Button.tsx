import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const baseStyles = "rounded-[30px] font-medium font-sans transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden";
  
  const variants = {
    primary: "bg-emerald-400 text-neutral-50 hover:bg-emerald-500",
    secondary: "bg-zinc-100 text-stone-900 hover:bg-zinc-200",
    outline: "outline outline-1 outline-offset-[-1px] outline-stone-900/20 text-stone-900 hover:bg-emerald-50 bg-transparent"
  };

  const sizes = {
    md: "px-10 py-3.5 text-base",
    lg: "px-12 py-4 text-xl"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};