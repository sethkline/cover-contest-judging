import React, { useState, useRef, useEffect } from "react";

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export type TooltipPosition = "top" | "right" | "bottom" | "left";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  sideOffset?: number;
  maxWidth?: number;
  disabled?: boolean;
}

export function Tooltip({
  content,
  children,
  position = "top",
  delay = 300,
  className = "",
  sideOffset = 5,
  maxWidth = 250,
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update tooltip position when it becomes visible
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      // Calculate position based on the current position prop
      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = triggerRect.top - tooltipRect.height - sideOffset;
          left =
            triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case "right":
          top =
            triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.right + sideOffset;
          break;
        case "bottom":
          top = triggerRect.bottom + sideOffset;
          left =
            triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case "left":
          top =
            triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.left - tooltipRect.width - sideOffset;
          break;
      }

      // Ensure the tooltip stays within the viewport
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      // Adjust for horizontal overflow
      if (left < 5) {
        left = 5;
      } else if (left + tooltipRect.width > viewport.width - 5) {
        left = viewport.width - tooltipRect.width - 5;
      }

      // Adjust for vertical overflow
      if (top < 5) {
        // If top position overflows, try bottom position
        if (position === "top") {
          top = triggerRect.bottom + sideOffset;
        } else {
          top = 5;
        }
      } else if (top + tooltipRect.height > viewport.height - 5) {
        // If bottom position overflows, try top position
        if (position === "bottom") {
          top = triggerRect.top - tooltipRect.height - sideOffset;
        } else {
          top = viewport.height - tooltipRect.height - 5;
        }
      }

      // Set tooltip position
      setTooltipPosition({ top, left });
    }
  }, [isVisible, position, sideOffset]);

  // Add scroll and resize listeners
  useEffect(() => {
    const handleOutsideEvents = () => {
      if (isVisible) {
        hideTooltip();
      }
    };

    window.addEventListener("scroll", handleOutsideEvents);
    window.addEventListener("resize", handleOutsideEvents);

    return () => {
      window.removeEventListener("scroll", handleOutsideEvents);
      window.removeEventListener("resize", handleOutsideEvents);
    };
  }, [isVisible]);

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Show tooltip after delay
  const showTooltip = () => {
    if (disabled) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  // Hide tooltip
  const hideTooltip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setIsVisible(false);
  };

  // Get tooltip arrow styles based on position
  const getArrowStyles = () => {
    switch (position) {
      case "top":
        return {
          bottom: -4,
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          borderRight: "1px solid",
          borderBottom: "1px solid",
        };
      case "right":
        return {
          left: -4,
          top: "50%",
          transform: "translateY(-50%) rotate(45deg)",
          borderLeft: "1px solid",
          borderBottom: "1px solid",
        };
      case "bottom":
        return {
          top: -4,
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          borderLeft: "1px solid",
          borderTop: "1px solid",
        };
      case "left":
        return {
          right: -4,
          top: "50%",
          transform: "translateY(-50%) rotate(45deg)",
          borderRight: "1px solid",
          borderTop: "1px solid",
        };
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            "fixed z-50 px-3 py-1.5 rounded-md shadow-md text-xs font-medium",
            "bg-neutral-800 text-white dark:bg-neutral-700 animate-in fade-in zoom-in-95 duration-100",
            className,
          )}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            maxWidth,
          }}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              "absolute h-2 w-2 bg-neutral-800 dark:bg-neutral-700",
              "border-neutral-800 dark:border-neutral-700",
            )}
            style={getArrowStyles()}
          />
        </div>
      )}
    </>
  );
}
