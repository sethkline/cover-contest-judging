import React from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

// Table container component
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'striped';
  size?: 'sm' | 'default' | 'lg';
  stickyHeader?: boolean;
}

export function Table({
  children,
  className = "",
  variant = 'default',
  size = 'default',
  stickyHeader = false,
  ...props
}: TableProps) {
  // Variant styles
  const variantStyles = {
    default: 'divide-y divide-neutral-200 dark:divide-neutral-700',
    bordered: 'border border-neutral-200 dark:border-neutral-700 divide-y divide-neutral-200 dark:divide-neutral-700',
    striped: 'divide-y divide-neutral-200 dark:divide-neutral-700 [&>tbody>tr:nth-child(odd)]:bg-neutral-50 dark:[&>tbody>tr:nth-child(odd)]:bg-neutral-800/50',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base',
  };
  
  return (
    <div className="w-full overflow-auto">
      <table
        className={cn(
          'w-full border-collapse',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

// Table header component
export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function TableHeader({ children, className = "", ...props }: TableHeaderProps) {
  return (
    <thead className={cn('bg-neutral-50 dark:bg-neutral-800', className)} {...props}>
      {children}
    </thead>
  );
}

// Table body component
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function TableBody({ children, className = "", ...props }: TableBodyProps) {
  return (
    <tbody className={cn('divide-y divide-neutral-200 dark:divide-neutral-700', className)} {...props}>
      {children}
    </tbody>
  );
}

// Table footer component
export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function TableFooter({ children, className = "", ...props }: TableFooterProps) {
  return (
    <tfoot 
      className={cn(
        'bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700',
        className
      )} 
      {...props}
    >
      {children}
    </tfoot>
  );
}

// Table row component
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  isSelected?: boolean;
  isClickable?: boolean;
}

export function TableRow({
  children,
  className = "",
  isSelected = false,
  isClickable = false,
  ...props
}: TableRowProps) {
  return (
    <tr
      className={cn(
        isSelected && 'bg-primary-50 dark:bg-primary-900/20',
        isClickable && 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

// Table head cell component
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  isSortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
}

export function TableHead({
  children,
  className = "",
  isSortable = false,
  sortDirection = null,
  ...props
}: TableHeadProps) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left font-medium text-neutral-700 dark:text-neutral-300',
        isSortable && 'cursor-pointer select-none',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1">
        {children}
        {isSortable && (
          <div className="ml-1">
            {sortDirection === 'asc' && <ChevronUp className="h-4 w-4" />}
            {sortDirection === 'desc' && <ChevronDown className="h-4 w-4" />}
            {sortDirection === null && <ChevronsUpDown className="h-4 w-4 opacity-50" />}
          </div>
        )}
      </div>
    </th>
  );
}

// Table cell component
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  truncate?: boolean;
}

export function TableCell({
  children,
  className = "",
  truncate = false,
  ...props
}: TableCellProps) {
  return (
    <td
      className={cn(
        'px-4 py-3',
        truncate && 'truncate max-w-[200px]',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

// Table caption component
export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  children: React.ReactNode;
}

export function TableCaption({ children, className = "", ...props }: TableCaptionProps) {
  return (
    <caption
      className={cn('py-2 text-sm text-neutral-500 dark:text-neutral-400', className)}
      {...props}
    >
      {children}
    </caption>
  );
}

// Empty state component for tables with no data
export interface TableEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  colSpan?: number;
}

export function TableEmptyState({
  children,
  colSpan = 1,
  className = "",
  ...props
}: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div
          className={cn(
            'flex flex-col items-center justify-center py-8 text-center',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </td>
    </tr>
  );
}