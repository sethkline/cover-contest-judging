// src/components/ui/input.tsx
import React from 'react';

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success';
  size?: 'default' | 'sm' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  className = "",
  variant = 'default',
  size = 'default',
  leftIcon,
  rightIcon,
  disabled = false,
  ...props
}: InputProps) {
  // Variant styles
  const variantStyles = {
    default: 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600',
    error: 'border-error-300 focus:border-error-500 focus:ring-error-500 dark:border-error-700',
    success: 'border-success-300 focus:border-success-500 focus:ring-success-500 dark:border-success-700',
  };

  // Size styles
  const sizeStyles = {
    default: 'h-10 px-3 py-2',
    sm: 'h-8 px-2 py-1 text-xs',
    lg: 'h-12 px-4 py-3 text-base',
  };

  const baseStyles = "w-full rounded-md border bg-white text-neutral-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-50";

  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
          {leftIcon}
        </div>
      )}
      <input
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          leftIcon ? 'pl-10' : '',
          rightIcon ? 'pr-10' : '',
          className
        )}
        disabled={disabled}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
          {rightIcon}
        </div>
      )}
    </div>
  );
}