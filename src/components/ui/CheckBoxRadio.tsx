import React from 'react';
import { Check } from 'lucide-react';

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

// Checkbox Component
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: 'left' | 'right';
  description?: string;
  error?: string;
  disabled?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'default' | 'lg';
  indeterminate?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  labelPosition = 'right',
  description,
  error,
  disabled = false,
  variant = 'default',
  size = 'default',
  indeterminate = false,
  className = "",
  ...props
}: CheckboxProps) {
  const checkboxRef = React.useRef<HTMLInputElement>(null);
  
  // Update the indeterminate property which isn't exposed in React
  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = !checked && indeterminate;
    }
  }, [checked, indeterminate]);
  
  // Size styles
  const sizeStyles = {
    sm: {
      checkbox: 'h-3.5 w-3.5',
      checkIcon: 'h-3 w-3',
      label: 'text-xs',
      description: 'text-xs',
    },
    default: {
      checkbox: 'h-4 w-4',
      checkIcon: 'h-3.5 w-3.5',
      label: 'text-sm',
      description: 'text-xs',
    },
    lg: {
      checkbox: 'h-5 w-5',
      checkIcon: 'h-4 w-4',
      label: 'text-base',
      description: 'text-sm',
    },
  };
  
  // Variant styles
  const variantStyles = {
    default: checked ? 'border-primary-600 bg-primary-600' : 'border-neutral-300 dark:border-neutral-600',
    success: checked ? 'border-success-600 bg-success-600' : 'border-neutral-300 dark:border-neutral-600',
    warning: checked ? 'border-warning-600 bg-warning-600' : 'border-neutral-300 dark:border-neutral-600',
    error: 'border-error-600',
  };
  
  const currentSize = sizeStyles[size];
  const currentVariant = error ? variantStyles.error : variantStyles[variant];
  
  // Handle checkbox change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };
  
  // Handle click on label to toggle checkbox
  const handleLabelClick = () => {
    if (!disabled && checkboxRef.current) {
      checkboxRef.current.click();
    }
  };
  
  const checkbox = (
    <div className="relative flex items-center">
      <input
        ref={checkboxRef}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      <div 
        className={cn(
          "rounded transition-colors flex items-center justify-center border",
          currentVariant,
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          currentSize.checkbox
        )}
      >
        {checked && !indeterminate && (
          <Check className={cn("text-white", currentSize.checkIcon)} />
        )}
        {indeterminate && !checked && (
          <div className="h-0.5 w-2 bg-white rounded" />
        )}
      </div>
    </div>
  );
  
  // If no label or description, just return the checkbox
  if (!label && !description) {
    return (
      <div className={className}>
        {checkbox}
      </div>
    );
  }
  
  // Return checkbox with label and optional description
  return (
    <div className={cn("flex items-start", className)}>
      {labelPosition === 'left' && (
        <div 
          className="mr-2" 
          onClick={handleLabelClick}
        >
          <label className={cn(
            "font-medium",
            disabled ? 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed' : 'cursor-pointer',
            currentSize.label
          )}>
            {label}
          </label>
          {description && (
            <p className={cn(
              "text-neutral-500 dark:text-neutral-400",
              currentSize.description
            )}>
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className={cn(labelPosition === 'right' ? "mt-0.5" : "")}>
        {checkbox}
      </div>
      
      {labelPosition === 'right' && (
        <div 
          className="ml-2" 
          onClick={handleLabelClick}
        >
          <label className={cn(
            "font-medium",
            disabled ? 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed' : 'cursor-pointer',
            currentSize.label
          )}>
            {label}
          </label>
          {description && (
            <p className={cn(
              "text-neutral-500 dark:text-neutral-400",
              currentSize.description
            )}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Radio Component
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: 'left' | 'right';
  description?: string;
  error?: string;
  disabled?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function Radio({
  checked,
  onChange,
  label,
  labelPosition = 'right',
  description,
  error,
  disabled = false,
  variant = 'default',
  size = 'default',
  className = "",
  ...props
}: RadioProps) {
  // Size styles
  const sizeStyles = {
    sm: {
      radio: 'h-3.5 w-3.5',
      dot: 'h-1.5 w-1.5',
      label: 'text-xs',
      description: 'text-xs',
    },
    default: {
      radio: 'h-4 w-4',
      dot: 'h-2 w-2',
      label: 'text-sm',
      description: 'text-xs',
    },
    lg: {
      radio: 'h-5 w-5',
      dot: 'h-2.5 w-2.5',
      label: 'text-base',
      description: 'text-sm',
    },
  };
  
  // Variant styles
  const variantStyles = {
    default: checked ? 'border-primary-600' : 'border-neutral-300 dark:border-neutral-600',
    success: checked ? 'border-success-600' : 'border-neutral-300 dark:border-neutral-600',
    warning: checked ? 'border-warning-600' : 'border-neutral-300 dark:border-neutral-600',
    error: 'border-error-600',
  };
  
  // Dot styles
  const dotStyles = {
    default: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    error: 'bg-error-600',
  };
  
  const currentSize = sizeStyles[size];
  const currentVariant = error ? variantStyles.error : variantStyles[variant];
  const currentDot = error ? dotStyles.error : dotStyles[variant];
  
  // Handle radio change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };
  
  // Handle click on label to select radio
  const handleLabelClick = () => {
    if (!disabled) {
      onChange(true);
    }
  };
  
  const radio = (
    <div className="relative flex items-center">
      <input
        type="radio"
        className="sr-only"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      <div 
        className={cn(
          "rounded-full transition-colors flex items-center justify-center border",
          currentVariant,
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          currentSize.radio
        )}
      >
        {checked && (
          <div className={cn("rounded-full", currentDot, currentSize.dot)} />
        )}
      </div>
    </div>
  );
  
  // If no label or description, just return the radio
  if (!label && !description) {
    return (
      <div className={className}>
        {radio}
      </div>
    );
  }
  
  // Return radio with label and optional description
  return (
    <div className={cn("flex items-start", className)}>
      {labelPosition === 'left' && (
        <div 
          className="mr-2" 
          onClick={handleLabelClick}
        >
          <label className={cn(
            "font-medium",
            disabled ? 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed' : 'cursor-pointer',
            currentSize.label
          )}>
            {label}
          </label>
          {description && (
            <p className={cn(
              "text-neutral-500 dark:text-neutral-400",
              currentSize.description
            )}>
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className={cn(labelPosition === 'right' ? "mt-0.5" : "")}>
        {radio}
      </div>
      
      {labelPosition === 'right' && (
        <div 
          className="ml-2" 
          onClick={handleLabelClick}
        >
          <label className={cn(
            "font-medium",
            disabled ? 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed' : 'cursor-pointer',
            currentSize.label
          )}>
            {label}
          </label>
          {description && (
            <p className={cn(
              "text-neutral-500 dark:text-neutral-400",
              currentSize.description
            )}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Radio Group Component
export interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }[];
  name: string;
  orientation?: 'vertical' | 'horizontal';
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'default' | 'lg';
  error?: string;
  className?: string;
}

export function RadioGroup({
  value,
  onChange,
  options,
  name,
  orientation = 'vertical',
  variant = 'default',
  size = 'default',
  error,
  className = "",
}: RadioGroupProps) {
  return (
    <div 
      className={cn(
        orientation === 'vertical' ? 'flex flex-col space-y-2' : 'flex flex-row flex-wrap gap-4',
        className
      )}
      role="radiogroup"
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
          label={option.label}
          description={option.description}
          disabled={option.disabled}
          variant={variant}
          size={size}
          error={error}
        />
      ))}
      
      {error && (
        <p className="text-xs text-error-600 dark:text-error-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}