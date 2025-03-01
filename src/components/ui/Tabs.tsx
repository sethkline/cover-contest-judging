import React, { useState, createContext, useContext, useRef, useEffect } from 'react';

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

// Create context for tab state
type TabsContextType = {
  activeTab: string;
  setActiveTab: (id: string) => void;
  orientation: 'horizontal' | 'vertical';
  variant: 'default' | 'underline' | 'pills' | 'bordered';
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Tabs Props
export interface TabsProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'underline' | 'pills' | 'bordered';
  className?: string;
}

export function Tabs({
  defaultValue,
  onChange,
  children,
  orientation = 'horizontal',
  variant = 'default',
  className = "",
}: TabsProps) {
  // Find the first tab if no default is provided
  const firstTabValueRef = useRef<string | null>(null);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (defaultValue) return defaultValue;
    return firstTabValueRef.current || "";
  });
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange && onChange(value);
  };
  
  // Set context value
  const contextValue = {
    activeTab,
    setActiveTab: handleTabChange,
    orientation,
    variant,
  };
  
  // Effect to update active tab if defaultValue changes
  useEffect(() => {
    if (defaultValue && defaultValue !== activeTab) {
      setActiveTab(defaultValue);
    }
  }, [defaultValue]);
  
  return (
    <TabsContext.Provider value={contextValue}>
      <div 
        className={cn(
          orientation === 'vertical' ? 'flex flex-row gap-2' : 'flex flex-col',
          className
        )}
        role="tablist"
        aria-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// Tab List Props
export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className = "" }: TabListProps) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabList must be used within a Tabs component');
  }
  
  const { orientation, variant } = context;
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'underline':
        return 'border-b border-neutral-200 dark:border-neutral-700';
      case 'bordered':
        return 'border border-neutral-200 dark:border-neutral-700 rounded-t-md p-1 bg-neutral-50 dark:bg-neutral-800';
      case 'pills':
        return 'p-1 bg-neutral-100 dark:bg-neutral-800 rounded-md';
      default:
        return 'border-b border-neutral-200 dark:border-neutral-700';
    }
  };
  
  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' 
          ? 'flex-row overflow-x-auto' 
          : 'flex-col',
        getVariantStyles(),
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  );
}

// Tab Props
export interface TabProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function Tab({ value, children, disabled = false, className = "", icon }: TabProps) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('Tab must be used within a Tabs component');
  }
  
  const { activeTab, setActiveTab, orientation, variant } = context;
  const isActive = activeTab === value;
  
  // Store first tab value for default selection
  useEffect(() => {
    if (!context.activeTab && !disabled) {
      setActiveTab(value);
    }
  }, []);
  
  // Get variant specific styles for the tab
  const getVariantStyles = () => {
    if (disabled) {
      return 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed';
    }
    
    switch (variant) {
      case 'underline':
        return isActive
          ? 'text-primary-600 dark:text-primary-500 border-b-2 border-primary-600 dark:border-primary-500'
          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 border-b-2 border-transparent';
      case 'pills':
        return isActive
          ? 'bg-primary-600 text-white'
          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700';
      case 'bordered':
        return isActive
          ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-500 border-b-0 border-t-2 border-primary-600 dark:border-primary-500'
          : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100';
      default:
        return isActive
          ? 'text-primary-600 dark:text-primary-500 border-b-2 border-primary-600 dark:border-primary-500'
          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 border-b-2 border-transparent';
    }
  };
  
  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      className={cn(
        'flex items-center justify-center px-4 py-2 font-medium text-sm transition-colors',
        orientation === 'horizontal' ? 'flex-shrink-0' : 'text-left justify-start',
        variant === 'pills' && 'rounded-md',
        getVariantStyles(),
        className
      )}
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

// Tab Panels Container
export interface TabPanelsProps {
  children: React.ReactNode;
  className?: string;
}

export function TabPanels({ children, className = "" }: TabPanelsProps) {
  return (
    <div className={cn("mt-2", className)}>
      {children}
    </div>
  );
}

// Tab Panel
export interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className = "" }: TabPanelProps) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabPanel must be used within a Tabs component');
  }
  
  const { activeTab } = context;
  const isActive = activeTab === value;
  
  if (!isActive) return null;
  
  return (
    <div
      role="tabpanel"
      tabIndex={0}
      aria-labelledby={`tab-${value}`}
      className={cn("focus:outline-none", className)}
    >
      {children}
    </div>
  );
}