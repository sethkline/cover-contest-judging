import React from "react";

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface ToggleProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > {
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?: "default" | "success" | "warning" | "error";
  size?: "sm" | "default" | "lg";
  label?: string;
  labelPosition?: "left" | "right";
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function Toggle({
  checked,
  onChange,
  variant = "default",
  size = "default",
  label,
  labelPosition = "right",
  disabled = false,
  className = "",
  icon,
  ...props
}: ToggleProps) {
  // Variant styles (for the background when checked)
  const variantStyles = {
    default: "bg-primary-600 dark:bg-primary-600",
    success: "bg-success-600 dark:bg-success-600",
    warning: "bg-warning-600 dark:bg-warning-600",
    error: "bg-error-600 dark:bg-error-600",
  };

  // Size styles
  const sizeStyles = {
    sm: {
      track: "h-4 w-7",
      thumb: "h-3 w-3",
      translateX: "translate-x-3",
      icon: "h-1.5 w-1.5",
      label: "text-xs",
    },
    default: {
      track: "h-6 w-11",
      thumb: "h-5 w-5",
      translateX: "translate-x-5",
      icon: "h-3 w-3",
      label: "text-sm",
    },
    lg: {
      track: "h-8 w-14",
      thumb: "h-7 w-7",
      translateX: "translate-x-6",
      icon: "h-4 w-4",
      label: "text-base",
    },
  };

  const currentSize = sizeStyles[size];

  // Handle toggle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  // Handle click on label to toggle
  const handleLabelClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const toggle = (
    <div className={cn("inline-flex items-center", className)}>
      <label className="relative inline-block">
        {/* Hidden input for accessibility */}
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />

        {/* Toggle track */}
        <div
          className={cn(
            "rounded-full transition-colors",
            checked
              ? variantStyles[variant]
              : "bg-neutral-200 dark:bg-neutral-700",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            currentSize.track,
          )}
        >
          {/* Toggle thumb */}
          <div
            className={cn(
              "rounded-full bg-white shadow-sm transform transition-transform",
              checked ? currentSize.translateX : "translate-x-0.5",
              "absolute top-0.5 left-0",
              currentSize.thumb,
              "flex items-center justify-center",
            )}
          >
            {/* Optional icon inside thumb */}
            {icon && checked && (
              <div className={cn("text-primary-600", currentSize.icon)}>
                {icon}
              </div>
            )}
          </div>
        </div>
      </label>
    </div>
  );

  // If no label, just return the toggle
  if (!label) {
    return toggle;
  }

  // Return toggle with label in specified position
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      {labelPosition === "left" && (
        <span
          className={cn("font-medium", currentSize.label)}
          onClick={handleLabelClick}
        >
          {label}
        </span>
      )}

      {toggle}

      {labelPosition === "right" && (
        <span
          className={cn("font-medium", currentSize.label)}
          onClick={handleLabelClick}
        >
          {label}
        </span>
      )}
    </div>
  );
}
