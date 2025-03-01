// src/components/ui/file-uploader.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, File, Image, AlertCircle } from 'lucide-react';

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface FileUploaderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  value?: File | File[];
  onChange?: (files: File | File[] | null) => void;
  onError?: (error: string) => void;
  variant?: 'default' | 'compact' | 'image';
  multiple?: boolean;
  label?: string;
  description?: string;
  previewImages?: boolean;
  dragAndDrop?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FileUploader({
  accept,
  maxSize,
  maxFiles = 1,
  value,
  onChange,
  onError,
  variant = 'default',
  multiple = false,
  label = 'Upload file',
  description,
  previewImages = true,
  dragAndDrop = true,
  disabled = false,
  className = "",
  ...props
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  // Convert value prop to array of files
  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        setFiles(value);
      } else {
        setFiles([value]);
      }
    } else {
      setFiles([]);
    }
  }, [value]);
  
  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Get icon for file type
  const getFileIcon = (file: File): React.ReactNode => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-neutral-500" />;
    }
    return <File className="h-8 w-8 text-neutral-500" />;
  };
  
  // Check if file type is image
  const isImage = (file: File): boolean => {
    return file.type.startsWith('image/');
  };
  
  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    validateAndSetFiles(Array.from(fileList));
  };
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setDragActive(false);
    
    const fileList = e.dataTransfer.files;
    if (!fileList) return;
    
    validateAndSetFiles(Array.from(fileList));
  };
  
  // Validate files and set state
  const validateAndSetFiles = (newFiles: File[]) => {
    // Reset errors
    setErrors([]);
    const newErrors: string[] = [];
    
    // Check for max files
    if (multiple) {
      if (files.length + newFiles.length > maxFiles) {
        const error = `You can only upload up to ${maxFiles} files`;
        newErrors.push(error);
        onError && onError(error);
        return;
      }
    } else if (newFiles.length > 1) {
      const error = 'You can only upload one file';
      newErrors.push(error);
      onError && onError(error);
      return;
    }
    
    // Validate each file
    const validFiles = newFiles.filter(file => {
      // Check file type
      if (accept) {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        
        // Handle image/* pattern
        const isAccepted = acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            const category = type.replace('/*', '');
            return fileType.startsWith(`${category}/`);
          }
          return type === fileType;
        });
        
        if (!isAccepted) {
          const error = `File type "${file.type}" is not supported`;
          newErrors.push(error);
          onError && onError(error);
          return false;
        }
      }
      
      // Check file size
      if (maxSize && file.size > maxSize) {
        const error = `File size exceeds the maximum limit of ${formatFileSize(maxSize)}`;
        newErrors.push(error);
        onError && onError(error);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // Update files state
    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
    setFiles(updatedFiles);
    
    // Call onChange callback
    if (onChange) {
      if (multiple) {
        onChange(updatedFiles);
      } else {
        onChange(updatedFiles[0]);
      }
    }
    
    // Clear input value to allow uploading the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  // Remove a file
  const removeFile = (index: number) => {
    if (disabled) return;
    
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    
    // Call onChange callback
    if (onChange) {
      if (multiple) {
        onChange(updatedFiles.length > 0 ? updatedFiles : null);
      } else {
        onChange(null);
      }
    }
  };
  
  // Trigger file input click
  const handleButtonClick = () => {
    if (disabled) return;
    
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return 'p-2 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-md';
      case 'image':
        return 'p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg text-center';
      default:
        return 'p-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg text-center';
    }
  };
  
  // Render file preview
  const renderFilePreview = (file: File, index: number) => {
    return (
      <div 
        key={`${file.name}-${index}`}
        className="flex items-center p-2 rounded-md bg-neutral-50 dark:bg-neutral-800 mb-2"
      >
        {previewImages && isImage(file) ? (
          <div className="h-10 w-10 mr-3 flex-shrink-0 rounded overflow-hidden bg-neutral-200 dark:bg-neutral-700">
            <img 
              src={URL.createObjectURL(file)} 
              alt={file.name}
              className="h-full w-full object-cover"
              onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
            />
          </div>
        ) : (
          <div className="mr-3 flex-shrink-0">
            {getFileIcon(file)}
          </div>
        )}
        
        <div className="flex-1 min-w-0 mr-2">
          <div className="text-sm font-medium truncate">{file.name}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {formatFileSize(file.size)}
          </div>
        </div>
        
        {!disabled && (
          <button
            type="button"
            className="ml-auto p-1 text-neutral-400 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-400 rounded-full"
            onClick={() => removeFile(index)}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };
  
  return (
    <div className={cn("w-full", className)}>
      {/* File Input (hidden) */}
      <input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      
      {/* Drag and Drop Area */}
      <div
        className={cn(
          "relative",
          getVariantStyles(),
          dragActive ? 'border-primary-500 bg-primary-50 dark:border-primary-600 dark:bg-primary-900/20' : '',
          disabled ? 'opacity-50 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800' : 'cursor-pointer',
        )}
        onClick={handleButtonClick}
        onDragEnter={dragAndDrop ? handleDrag : undefined}
        onDragOver={dragAndDrop ? handleDrag : undefined}
        onDragLeave={dragAndDrop ? handleDrag : undefined}
        onDrop={dragAndDrop ? handleDrop : undefined}
      >
        {variant === 'image' ? (
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-10 w-10 text-neutral-400 mb-3" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</p>
            {description && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {description}
              </p>
            )}
            {dragAndDrop && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                or drag and drop
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <Upload className="h-6 w-6 text-neutral-400 mr-3 flex-shrink-0" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</p>
              {description && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-2">
          {errors.map((error, index) => (
            <div 
              key={index} 
              className="flex items-center text-xs text-error-600 dark:text-error-400"
            >
              <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
              {error}
            </div>
          ))}
        </div>
      )}
      
      {/* Files Preview */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => renderFilePreview(file, index))}
        </div>
      )}
    </div>
  );
}