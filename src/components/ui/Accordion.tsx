// src/components/ui/accordion.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

// Accordion Item Props
export interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  onOpenChange?: (isOpen: boolean) => void;
}

// Accordion Item Component
export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  disabled = false,
  icon,
  className = "",
  contentClassName = "",
  titleClassName = "",
  onOpenChange,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0,
  );

  // Calculate content height on mount and when content changes
  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (isOpen) {
            // When open, set to auto by setting to undefined
            setContentHeight(undefined);
          } else {
            // When closed, get the scrollHeight but keep it at 0
            setContentHeight(0);
          }
        }
      });

      resizeObserver.observe(contentRef.current);

      return () => {
        if (contentRef.current) {
          resizeObserver.unobserve(contentRef.current);
        }
      };
    }
  }, [isOpen]);

  // Handle toggle click
  const handleToggle = () => {
    if (disabled) return;

    // First measure the content height
    if (contentRef.current && !isOpen) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    } else {
      setContentHeight(0);
    }

    // Then toggle open state (after a tick to ensure height is applied)
    setTimeout(() => {
      setIsOpen(!isOpen);
      onOpenChange && onOpenChange(!isOpen);
    }, 0);
  };

  return (
    <div
      className={cn(
        "border border-neutral-200 dark:border-neutral-700 rounded-md overflow-hidden",
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium",
          "bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          disabled && "cursor-not-allowed",
          titleClassName,
        )}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span>{title}</span>
        </div>
        <span className="ml-2 flex-shrink-0 transition-transform duration-200">
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-neutral-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-neutral-500" />
          )}
        </span>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0",
          contentClassName,
        )}
        style={{ height: isOpen ? contentHeight : 0 }}
        aria-hidden={!isOpen}
      >
        <div
          ref={contentRef}
          className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// Accordion Props
export interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  defaultIndex?: number | number[];
  className?: string;
}

// Accordion Component
export function Accordion({
  children,
  allowMultiple = false,
  defaultIndex,
  className = "",
}: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>(() => {
    if (typeof defaultIndex === "number") {
      return [defaultIndex];
    } else if (Array.isArray(defaultIndex)) {
      return defaultIndex;
    }
    return [];
  });

  // Clone children with additional props
  const items = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return null;

    return React.cloneElement(child as React.ReactElement<AccordionItemProps>, {
      defaultOpen: openIndexes.includes(index),
      onOpenChange: (isOpen: boolean) => {
        if (isOpen) {
          // If opening this index
          if (allowMultiple) {
            setOpenIndexes([...openIndexes, index]);
          } else {
            setOpenIndexes([index]);
          }
        } else {
          // If closing this index
          setOpenIndexes(openIndexes.filter((i) => i !== index));
        }

        // Call the original onOpenChange if it exists
        if (child.props.onOpenChange) {
          child.props.onOpenChange(isOpen);
        }
      },
    });
  });

  return <div className={cn("space-y-2", className)}>{items}</div>;
}

// Collapsible Component (simplified version for single item)
export interface CollapsibleProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  triggerClassName?: string;
}

export function Collapsible({
  trigger,
  children,
  defaultOpen = false,
  disabled = false,
  className = "",
  contentClassName = "",
  triggerClassName = "",
}: CollapsibleProps) {
  return (
    <div className={className}>
      <AccordionItem
        title={trigger}
        defaultOpen={defaultOpen}
        disabled={disabled}
        titleClassName={triggerClassName}
        contentClassName={contentClassName}
      >
        {children}
      </AccordionItem>
    </div>
  );
}
