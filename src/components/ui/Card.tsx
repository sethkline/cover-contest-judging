import React from "react";

// Simple utility function to merge classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevation?: "flat" | "raised" | "outlined";
}

export function Card({
  className = "",
  children,
  elevation = "raised",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg",
        "bg-white dark:bg-neutral-800",
        {
          "border border-neutral-200 dark:border-neutral-700":
            elevation === "outlined",
          "shadow-md": elevation === "raised",
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({
  className = "",
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div className={cn("p-6 pb-0 space-y-1", className)} {...props}>
      {children}
    </div>
  );
}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function CardTitle({
  className = "",
  children,
  ...props
}: CardTitleProps) {
  return (
    <h3
      className={cn(
        "text-xl font-semibold leading-none tracking-tight",
        "text-neutral-900 dark:text-white",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function CardDescription({
  className = "",
  children,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={cn(
        "text-sm text-neutral-500 dark:text-neutral-400",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({
  className = "",
  children,
  ...props
}: CardContentProps) {
  return (
    <div className={cn("p-6 pt-4", className)} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({
  className = "",
  children,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn(
        "p-6 pt-0",
        "border-t border-neutral-200 dark:border-neutral-700 mt-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
