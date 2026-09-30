"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type AuthIconInputProps = React.ComponentProps<typeof Input> & {
  icon: React.ReactNode;
  trailing?: React.ReactNode;
};

export function AuthIconInput({
  icon,
  trailing,
  className,
  ...props
}: AuthIconInputProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon}
      </span>
      <Input
        className={cn(
          "h-11 rounded-lg border-line bg-primary-soft/50 pl-10 text-base md:text-sm",
          trailing ? "pr-10" : undefined,
          className
        )}
        {...props}
      />
      {trailing ? (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>
      ) : null}
    </div>
  );
}
