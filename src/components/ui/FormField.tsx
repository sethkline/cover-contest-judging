import React from 'react';

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  label?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
}

export function FormField({
  children,
  className = "",
  label,
  helpText,
  error,
  required = false,
  ...props
}: FormFieldProps) {
  // Generate a unique ID for the form field
  const [id] = React.useState(() => `field-${Math.random().toString(36).substr(2, 9)}`);

  return (
    <div className={cn("mb-4", className)} {...props}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement, {
            id,
            "aria-invalid": !!error,
            "aria-describedby": error ? `${id}-error` : helpText ? `${id}-description` : undefined,
            variant: error ? 'error' : (children as any).props.variant,
          })
        : children}
      
      {helpText && !error && (
        <p 
          id={`${id}-description`} 
          className="mt-1 text-sm text-neutral-500 dark:text-neutral-400"
        >
          {helpText}
        </p>
      )}
      
      {error && (
        <p 
          id={`${id}-error`} 
          className="mt-1 text-sm text-error-600 dark:text-error-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}