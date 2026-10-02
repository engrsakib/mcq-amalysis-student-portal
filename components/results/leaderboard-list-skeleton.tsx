"use client";

import { cn } from "@/lib/utils";

export function LeaderboardListSkeleton({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex min-h-11 items-center gap-3 rounded-lg px-2 py-2 sm:px-3"
        >
          <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 shrink-0 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
