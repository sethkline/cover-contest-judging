// src/components/ui/alert.tsx
import React from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  hideCloseButton?: boolean;
}

export function Alert({
  className = "",
  variant = 'info',
  title,
  children,
  icon,
  onClose,
  hideCloseButton = false,
  ...props
}: AlertProps) {
  // Variant styles
  const variantStyles = {
    info: {
      container: 'bg-info-50 text-info-900 border-info-200 dark:bg-info-900/20 dark:text-info-300 dark:border-info-800',
      icon: <Info className="h-5 w-5 text-info-500 dark:text-info-400" />,
    },
    success: {
      container: 'bg-success-50 text-success-900 border-success-200 dark:bg-success-900/20 dark:text-success-300 dark:border-success-800',
      icon: <CheckCircle className="h-5 w-5 text-success-500 dark:text-success-400" />,
    },
    warning: {
      container: 'bg-warning-50 text-warning-900 border-warning-200 dark:bg-warning-900/20 dark:text-warning-300 dark:border-warning-800',
      icon: <AlertTriangle className="h-5 w-5 text-warning-500 dark:text-warning-400" />,
    },
    error: {
      container: 'bg-error-50 text-error-900 border-error-200 dark:bg-error-900/20 dark:text-error-300 dark:border-error-800',
      icon: <AlertCircle className="h-5 w-5 text-error-500 dark:text-error-400" />,
    },
  };

  const variantStyle = variantStyles[variant];

  return (
    <div
      className={cn(
        "relative rounded-md border p-4",
        variantStyle.container,
        className
      )}
      role="alert"
      {...props}
    >
      <div className="flex">
        {/* Icon */}
        {icon !== undefined ? (
          <div className="flex-shrink-0">{icon}</div>
        ) : (
          <div className="flex-shrink-0">{variantStyle.icon}</div>
        )}
        
        {/* Content */}
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          <div className={cn("text-sm", title && "mt-1")}>
            {children}
          </div>
        </div>
        
        {/* Close button */}
        {onClose && !hideCloseButton && (
          <button
            type="button"
            className="ml-auto flex-shrink-0 -mr-1 -mt-1 rounded-md p-1.5 inline-flex text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}