"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; // utility for classnames, assumed existent

/**
 * Simple Tabs component based on Radix UI style, but implemented with React state.
 * Designed to fit the project's existing design system (tailwind, shadcn conventions).
 */
export function Tabs({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [value, setValue] = React.useState(defaultValue);
  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, { value, setValue });
      })}
    </div>
  );
}

export function TabsList({
  children,
  className,
  value,
  setValue,
}: {
  children: React.ReactNode;
  className?: string;
  value?: string;
  setValue?: (v: string) => void;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-10 rounded-md bg-muted p-1 text-muted-foreground",
        className,
      )}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, { isActive: child.props.value === value, setValue });
      })}
    </div>
  );
}

export function TabsTrigger({
  value: triggerValue,
  children,
  className,
  isActive,
  setValue,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  setValue?: (v: string) => void;
}) {
  return (
    <button
      role="tab"
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "flex items-center justify-center rounded-sm px-3 text-sm font-medium transition-colors",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      onClick={() => setValue?.(triggerValue)}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value: contentValue,
  children,
  className,
  value: activeValue,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  value?: string;
}) {
  if (activeValue !== contentValue) return null;
  return (
    <div className={cn("mt-4 rounded-md border bg-card p-6", className)}>
      {children}
    </div>
  );
}
