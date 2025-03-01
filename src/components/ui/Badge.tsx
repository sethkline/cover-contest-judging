import React from 'react';

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  rounded?: 'default' | 'full';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'default',
  rounded = 'default',
  children,
  className = "",
  icon,
  ...props
}: BadgeProps) {
  // Variant styles
  const variantStyles = {
    default: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300',
    secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-300',
    success: 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300',
    error: 'bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-300',
    info: 'bg-info-100 text-info-800 dark:bg-info-900/20 dark:text-info-300',
    outline: 'bg-transparent border border-neutral-300 text-neutral-800 dark:border-neutral-600 dark:text-neutral-300',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };
  
  // Rounded styles
  const roundedStyles = {
    default: 'rounded',
    full: 'rounded-full',
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium',
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles[rounded],
        className
      )}
      {...props}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}