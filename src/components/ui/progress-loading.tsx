import React from 'react';

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

// Progress Bar Component
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showValue?: boolean;
  formatValue?: (value: number, max: number) => string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'default' | 'lg';
  striped?: boolean;
  animated?: boolean;
  indeterminate?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  showValue = false,
  formatValue,
  variant = 'default',
  size = 'default',
  striped = false,
  animated = false,
  indeterminate = false,
  className = "",
  ...props
}: ProgressBarProps) {
  // Ensure value is in bounds
  const clampedValue = Math.max(0, Math.min(value, max));
  const percentage = (clampedValue / max) * 100;
  
  // Variant styles for progress bar fill
  const variantStyles = {
    default: 'bg-primary-600 dark:bg-primary-500',
    success: 'bg-success-600 dark:bg-success-500',
    warning: 'bg-warning-600 dark:bg-warning-500',
    error: 'bg-error-600 dark:bg-error-500',
    info: 'bg-info-600 dark:bg-info-500',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'h-1',
    default: 'h-2',
    lg: 'h-4',
  };
  
  // Format the displayed value
  const displayValue = formatValue
    ? formatValue(clampedValue, max)
    : `${Math.round(percentage)}%`;
  
  return (
    <div
      className={cn("w-full", className)}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clampedValue}
      aria-valuemin={0}
      aria-valuemax={max}
      {...props}
    >
      {showValue && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {displayValue}
          </span>
        </div>
      )}
      
      <div className={cn(
        "w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden",
        sizeStyles[size]
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all",
            variantStyles[variant],
            striped && !indeterminate && "bg-stripes",
            animated && striped && !indeterminate && "animate-progress-stripes",
            indeterminate && "animate-progress-indeterminate w-1/3"
          )}
          style={{
            width: indeterminate ? undefined : `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

// Spinner Component
export interface SpinnerProps extends React.SVGAttributes<SVGElement> {
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  label?: string;
}

export function Spinner({
  size = 'default',
  variant = 'default',
  label = 'Loading',
  className = "",
  ...props
}: SpinnerProps) {
  // Size mappings
  const sizeStyles = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };
  
  // Variant styles for stroke color
  const variantStyles = {
    default: 'text-primary-600 dark:text-primary-500',
    success: 'text-success-600 dark:text-success-500',
    warning: 'text-warning-600 dark:text-warning-500',
    error: 'text-error-600 dark:text-error-500',
    info: 'text-info-600 dark:text-info-500',
  };
  
  return (
    <div className="inline-flex items-center">
      <svg
        className={cn(
          "animate-spin",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      
      {label && (
        <span className="ml-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
      )}
    </div>
  );
}

// LoadingDots Component
export interface LoadingDotsProps {
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function LoadingDots({
  size = 'default',
  variant = 'default',
  className = "",
}: LoadingDotsProps) {
  // Size mappings
  const sizeStyles = {
    sm: 'h-1 w-1 mx-0.5',
    default: 'h-2 w-2 mx-1',
    lg: 'h-3 w-3 mx-1.5',
  };
  
  // Variant styles for background color
  const variantStyles = {
    default: 'bg-primary-600 dark:bg-primary-500',
    success: 'bg-success-600 dark:bg-success-500',
    warning: 'bg-warning-600 dark:bg-warning-500',
    error: 'bg-error-600 dark:bg-error-500',
    info: 'bg-info-600 dark:bg-info-500',
  };
  
  return (
    <div className={cn("flex items-center", className)} aria-label="Loading">
      <div className={cn(
        "rounded-full animate-loading-dot-1",
        sizeStyles[size],
        variantStyles[variant]
      )} />
      <div className={cn(
        "rounded-full animate-loading-dot-2",
        sizeStyles[size],
        variantStyles[variant]
      )} />
      <div className={cn(
        "rounded-full animate-loading-dot-3",
        sizeStyles[size],
        variantStyles[variant]
      )} />
    </div>
  );
}

// LoadingOverlay Component
export interface LoadingOverlayProps {
  active: boolean;
  spinner?: React.ReactNode;
  text?: string;
  blur?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function LoadingOverlay({
  active,
  spinner,
  text = "Loading...",
  blur = true,
  className = "",
  children,
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      
      {active && (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center",
            "bg-white/80 dark:bg-neutral-900/80",
            blur && "backdrop-blur-sm",
            "z-50 transition-all duration-300",
            className
          )}
        >
          {spinner || <Spinner size="lg" />}
          {text && (
            <div className="mt-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}