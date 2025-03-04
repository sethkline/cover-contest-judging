import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface SidebarItemProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  children?: SidebarItemProps[];
}

export interface SidebarProps {
  items: SidebarItemProps[];
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function SidebarItem({
  href,
  label,
  icon,
  active = false,
  children,
}: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = children && children.length > 0;

  return (
    <div>
      <Link
        href={href}
        className={cn(
          "flex items-center px-4 py-3 text-sm rounded-md my-1",
          active
            ? "text-white bg-primary-600"
            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800",
          hasChildren ? "justify-between" : "",
        )}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex items-center">
          {icon && <span className="mr-3">{icon}</span>}
          <span>{label}</span>
        </div>
        {hasChildren && (
          <span>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
      </Link>

      {/* Nested items */}
      {hasChildren && isOpen && (
        <div className="ml-4 pl-2 border-l border-neutral-200 dark:border-neutral-700 mt-1">
          {children.map((child, index) => (
            <Link
              key={index}
              href={child.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm rounded-md my-1",
                child.active
                  ? "text-white bg-primary-600"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800",
              )}
            >
              {child.icon && <span className="mr-3">{child.icon}</span>}
              <span>{child.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  items,
  collapsed = false,
  onCollapse,
  className,
  header,
  footer,
}: SidebarProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800",
        collapsed ? "w-16" : "w-64",
        "transition-all duration-300",
        className,
      )}
    >
      {/* Header/Logo */}
      {header && (
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          {header}
        </div>
      )}

      {/* Collapse button */}
      {onCollapse && (
        <button
          className="p-2 m-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white self-end"
          onClick={() => onCollapse(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      )}

      {/* Navigation items */}
      <nav className="flex-grow p-2 overflow-y-auto">
        {items.map((item, index) => (
          <SidebarItem
            key={index}
            href={item.href}
            label={collapsed ? "" : item.label}
            icon={item.icon}
            active={item.active}
            children={!collapsed ? item.children : undefined}
          />
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          {footer}
        </div>
      )}
    </div>
  );
}

// Helper icon component for sidebar icons
export function ChevronLeft(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
