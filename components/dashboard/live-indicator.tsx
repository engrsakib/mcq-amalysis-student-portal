"use client";

import { cn } from "@/lib/utils";

type LiveIndicatorProps = {
  className?: string;
};

export function LiveIndicator({ className }: LiveIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg bg-danger-soft px-2 py-1 text-xs font-semibold uppercase tracking-wide text-danger",
        className
      )}
      aria-label="Live now"
    >
      <span
        className={cn(
          "size-2 shrink-0 rounded-full bg-danger",
          "motion-safe:animate-pulse"
        )}
        aria-hidden
      />
      Live
    </span>
  );
}
