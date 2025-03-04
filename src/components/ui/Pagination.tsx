// src/components/ui/pagination.tsx
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "minimal" | "compact";
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  size = "default",
  variant = "default",
  className = "",
}: PaginationProps) {
  // Ensure current page is within bounds
  const page = Math.max(1, Math.min(currentPage, totalPages));

  // Size variants
  const sizeStyles = {
    sm: "h-8 min-w-8 text-xs",
    default: "h-10 min-w-10 text-sm",
    lg: "h-12 min-w-12 text-base",
  };

  // Calculate page ranges to display
  const getPageRange = (): (number | "ellipsis")[] => {
    // For small number of pages, show all
    if (totalPages <= 5 + siblingCount * 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate boundaries
    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

    // Should show ellipsis
    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

    // Special case 1: right ellipsis only
    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const leftRange = Array.from(
        { length: 3 + siblingCount * 2 },
        (_, i) => i + 1,
      );
      return [...leftRange, "ellipsis", totalPages];
    }

    // Special case 2: left ellipsis only
    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      const rightRange = Array.from(
        { length: 3 + siblingCount * 2 },
        (_, i) => totalPages - i,
      ).reverse();
      return [1, "ellipsis", ...rightRange];
    }

    // Case 3: both ellipses
    if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );
      return [1, "ellipsis", ...middleRange, "ellipsis", totalPages];
    }

    return [];
  };

  // Generate range of pages
  const range = getPageRange();

  // Handle navigating to previous/next pages
  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  // Render compact pagination with just prev/next
  if (variant === "compact") {
    return (
      <div
        className={cn("flex items-center justify-center space-x-2", className)}
      >
        <PaginationInfo currentPage={page} totalPages={totalPages} />

        <div className="flex">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className={cn(
              "flex items-center justify-center rounded-l-md border border-neutral-300 dark:border-neutral-700",
              "text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900",
              "hover:bg-neutral-50 dark:hover:bg-neutral-800",
              "disabled:opacity-50 disabled:pointer-events-none",
              sizeStyles[size],
            )}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={cn(
              "flex items-center justify-center rounded-r-md border border-l-0 border-neutral-300 dark:border-neutral-700",
              "text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900",
              "hover:bg-neutral-50 dark:hover:bg-neutral-800",
              "disabled:opacity-50 disabled:pointer-events-none",
              sizeStyles[size],
            )}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Render minimal pagination with just buttons
  if (variant === "minimal") {
    return (
      <div
        className={cn("flex items-center justify-center space-x-2", className)}
      >
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className={cn(
            "flex items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700",
            "text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900",
            "hover:bg-neutral-50 dark:hover:bg-neutral-800",
            "disabled:opacity-50 disabled:pointer-events-none",
            sizeStyles[size],
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {range.map((pageNum, i) =>
          pageNum === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="flex items-center justify-center"
            >
              <MoreHorizontal className="h-4 w-4 text-neutral-400 dark:text-neutral-600" />
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "flex items-center justify-center rounded-md",
                pageNum === page
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800",
                sizeStyles[size],
              )}
              aria-current={pageNum === page ? "page" : undefined}
            >
              {pageNum}
            </button>
          ),
        )}

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className={cn(
            "flex items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700",
            "text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900",
            "hover:bg-neutral-50 dark:hover:bg-neutral-800",
            "disabled:opacity-50 disabled:pointer-events-none",
            sizeStyles[size],
          )}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4",
        className,
      )}
    >
      <PaginationInfo currentPage={page} totalPages={totalPages} />

      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className={cn(
            "flex items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700",
            "text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900",
            "hover:bg-neutral-50 dark:hover:bg-neutral-800",
            "disabled:opacity-50 disabled:pointer-events-none",
            sizeStyles[size],
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {range.map((pageNum, i) =>
          pageNum === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="flex items-center justify-center"
            >
              <MoreHorizontal className="h-4 w-4 text-neutral-400 dark:text-neutral-600" />
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "flex items-center justify-center rounded-md",
                pageNum === page
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800",
                sizeStyles[size],
              )}
              aria-current={pageNum === page ? "page" : undefined}
            >
              {pageNum}
            </button>
          ),
        )}

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className={cn(
            "flex items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700",
            "text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900",
            "hover:bg-neutral-50 dark:hover:bg-neutral-800",
            "disabled:opacity-50 disabled:pointer-events-none",
            sizeStyles[size],
          )}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Helper component for displaying current page info
interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
}

function PaginationInfo({ currentPage, totalPages }: PaginationInfoProps) {
  return (
    <div className="text-sm text-neutral-600 dark:text-neutral-400">
      Page{" "}
      <span className="font-medium text-neutral-900 dark:text-white">
        {currentPage}
      </span>{" "}
      of{" "}
      <span className="font-medium text-neutral-900 dark:text-white">
        {totalPages}
      </span>
    </div>
  );
}
