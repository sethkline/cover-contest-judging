import React from "react";

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "error" | "success";
  resize?: "none" | "vertical" | "horizontal" | "both";
}

export function TextArea({
  className = "",
  variant = "default",
  resize = "vertical",
  disabled = false,
  rows = 4,
  ...props
}: TextAreaProps) {
  // Variant styles
  const variantStyles = {
    default:
      "border-neutral-300 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600",
    error:
      "border-error-300 focus:border-error-500 focus:ring-error-500 dark:border-error-700",
    success:
      "border-success-300 focus:border-success-500 focus:ring-success-500 dark:border-success-700",
  };

  // Resize styles
  const resizeStyles = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
  };

  return (
    <textarea
      className={cn(
        "w-full rounded-md border bg-white px-3 py-2 text-neutral-900 shadow-sm",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-50",
        variantStyles[variant],
        resizeStyles[resize],
        className,
      )}
      rows={rows}
      disabled={disabled}
      {...props}
    />
  );
}
