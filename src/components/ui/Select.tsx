// src/components/ui/select.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  variant?: 'default' | 'error' | 'success';
  size?: 'default' | 'sm' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function Select({
  className = "",
  options,
  variant = 'default',
  size = 'default',
  fullWidth = false,
  icon,
  disabled = false,
  ...props
}: SelectProps) {
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

  return (
    <div className={cn(
      "relative",
      fullWidth ? "w-full" : "",
    )}>
      <select
        className={cn(
          "appearance-none rounded-md border bg-white text-neutral-900 shadow-sm",
          "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-50",
          "pr-10", // Space for the custom arrow icon
          icon ? "pl-10" : "",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? "w-full" : "",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom arrow icon */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
        <ChevronDown size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      </div>
      
      {/* Optional left icon */}
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-neutral-500">
          {icon}
        </div>
      )}
    </div>
  );
}