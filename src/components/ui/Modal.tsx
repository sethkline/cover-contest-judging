// src/components/ui/modal.tsx
import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOutsideClick?: boolean;
  hideCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
  footerContent?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  closeOnOutsideClick = true,
  hideCloseButton = false,
  className = "",
  contentClassName = "",
  footerContent,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full max-h-full m-4',
  };
  
  // Handle Escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Early return if modal is not open
  if (!isOpen) {
    return null;
  }
  
  // Handle background click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div
        ref={modalRef}
        className={cn(
          "relative bg-white dark:bg-neutral-900 rounded-lg shadow-xl overflow-hidden w-full",
          "animate-in fade-in zoom-in-95 duration-300",
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
            {title && (
              <h3 
                id="modal-title" 
                className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {title}
              </h3>
            )}
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 ml-auto rounded-md text-neutral-400 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className={cn("p-6", contentClassName)}>
          {description && (
            <p id="modal-description" className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {description}
            </p>
          )}
          {children}
        </div>
        
        {/* Footer */}
        {footerContent && (
          <div className="flex items-center justify-end p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
}

// Convenience components for Dialog layout
export function ModalTitle({ children, className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 
      className={cn("text-lg font-semibold text-neutral-900 dark:text-neutral-100", className)} 
      {...props}
    >
      {children}
    </h3>
  );
}

export function ModalDescription({ children, className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn("text-sm text-neutral-500 dark:text-neutral-400 mt-2", className)} 
      {...props}
    >
      {children}
    </p>
  );
}

export function ModalFooter({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("flex items-center justify-end space-x-2", className)} 
      {...props}
    >
      {children}
    </div>
  );
}