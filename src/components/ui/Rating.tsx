import React, { useState } from 'react';

// Simple utility function to merge classNames
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export interface RatingProps {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'default' | 'lg';
  showValue?: boolean;
  disabled?: boolean;
  variant?: 'numeric' | 'slider';
  className?: string;
  label?: string;
}

export function Rating({
  value = 0,
  max = 10,
  onChange,
  size = 'default',
  showValue = true,
  disabled = false,
  variant = 'slider',
  className = "",
  label,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  // Size styles for slider thumb
  const thumbSizes = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  
  // Size styles for container
  const containerSizes = {
    sm: 'h-8',
    default: 'h-10',
    lg: 'h-12',
  };
  
  // Font sizes for value display
  const fontSizes = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg',
  };

  // Get the display for the current value
  const displayValue = hoverValue !== null ? hoverValue : value;
  
  if (variant === 'numeric') {
    return (
      <div className={cn("flex flex-col", className)}>
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            {label}
          </label>
        )}
        <div className="flex space-x-2">
          {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              className={cn(
                "flex items-center justify-center rounded-md transition-colors",
                size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm',
                num <= displayValue
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              )}
              onClick={() => !disabled && onChange && onChange(num)}
              onMouseEnter={() => !disabled && setHoverValue(num)}
              onMouseLeave={() => !disabled && setHoverValue(null)}
              disabled={disabled}
              aria-label={`Rate ${num} out of ${max}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  // Slider variant
  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          {label}
        </label>
      )}
      <div className={cn(
        "relative flex items-center",
        containerSizes[size]
      )}>
        <input
          type="range"
          min={0}
          max={max}
          value={value}
          onChange={(e) => !disabled && onChange && onChange(Number(e.target.value))}
          className={cn(
            "w-full appearance-none bg-neutral-200 dark:bg-neutral-700 rounded-full",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            size === 'sm' ? 'h-1' : size === 'lg' ? 'h-2' : 'h-1.5',
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          )}
          style={{
            // Use inline styles for the thumb since we can't use Tailwind's arbitrary values
            '--webkit-slider-thumb-width': size === 'sm' ? '0.75rem' : size === 'lg' ? '1.25rem' : '1rem',
            '--webkit-slider-thumb-height': size === 'sm' ? '0.75rem' : size === 'lg' ? '1.25rem' : '1rem'
          }}
          disabled={disabled}
          aria-label={label || `Rating: ${value} of ${max}`}
        />
        
        {showValue && (
          <div className={cn(
            "ml-4 w-8 text-center font-medium text-neutral-700 dark:text-neutral-300",
            fontSizes[size]
          )}>
            {value}/{max}
          </div>
        )}
      </div>
      
      <style jsx>{`
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          width: var(--webkit-slider-thumb-width);
          height: var(--webkit-slider-thumb-height);
          background: var(--primary-600, #db2777);
          border-radius: 50%;
          cursor: pointer;
        }
        
        input[type=range]::-moz-range-thumb {
          width: var(--webkit-slider-thumb-width);
          height: var(--webkit-slider-thumb-height);
          background: var(--primary-600, #db2777);
          border-radius: 50%;
          border: none;
          cursor: pointer;
        }
        
        input[type=range]::-ms-thumb {
          width: var(--webkit-slider-thumb-width);
          height: var(--webkit-slider-thumb-height);
          background: var(--primary-600, #db2777);
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}