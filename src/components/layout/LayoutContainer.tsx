// src/components/layout/layout-container.tsx
import React, { useState } from 'react';
import { Header, HeaderProps } from './Header';
import { Sidebar, SidebarProps } from './Sidebar';

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface LayoutContainerProps {
  children: React.ReactNode;
  hasSidebar?: boolean;
  headerProps?: HeaderProps;
  sidebarProps?: SidebarProps;
  className?: string;
  contentClassName?: string;
}

export function LayoutContainer({
  children,
  hasSidebar = false,
  headerProps,
  sidebarProps,
  className,
  contentClassName
}: LayoutContainerProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      {/* Header */}
      <Header {...headerProps} />
      
      {/* Main content with optional sidebar */}
      <div className="flex flex-grow">
        {/* Sidebar (optional) */}
        {hasSidebar && sidebarProps && (
          <Sidebar 
            {...sidebarProps} 
            collapsed={sidebarCollapsed}
            onCollapse={setSidebarCollapsed}
          />
        )}
        
        {/* Main content */}
        <main 
          className={cn(
            "flex-grow p-4 sm:p-6 lg:p-8 bg-neutral-50 dark:bg-neutral-900",
            contentClassName
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}