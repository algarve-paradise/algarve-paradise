"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Simple Tabs implementation based on React context. This avoids the need to
 * manually clone element props and gives proper TypeScript inference.
 */
interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

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
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn("flex flex-col space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-10 rounded-md bg-muted p-1 text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value: triggerValue,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;
  const isActive = ctx.value === triggerValue;
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
      onClick={() => ctx.setValue(triggerValue)}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value: contentValue,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;
  if (ctx.value !== contentValue) return null;
  return (
    <div className={cn("mt-4 rounded-md border bg-card p-6", className)}>
      {children}
    </div>
  );
}
