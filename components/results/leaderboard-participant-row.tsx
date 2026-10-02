"use client";

import type { LeaderboardEntry } from "@/lib/api/types";
import { formatLeaderboardScore } from "@/lib/results/format-score";
import { getInitials } from "@/lib/user/display";
import { cn } from "@/lib/utils";

type LeaderboardParticipantRowProps = {
  entry: LeaderboardEntry;
  className?: string;
  highlight?: boolean;
};

export function LeaderboardParticipantRow({
  entry,
  className,
  highlight = false,
}: LeaderboardParticipantRowProps) {
  const name = entry.student_name?.trim() || "Student";

  return (
    <div
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-lg px-2 py-2 sm:px-3",
        highlight && "bg-primary/5 ring-1 ring-primary/20",
        className
      )}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold tabular-nums text-muted-foreground"
        aria-hidden
      >
        {entry.rank}
      </span>
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
        aria-hidden
      >
        {getInitials(name)}
      </span>
      <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
        {name}
      </p>
      <p className="shrink-0 text-sm font-semibold tabular-nums text-primary">
        {formatLeaderboardScore(entry.score)}
      </p>
    </div>
  );
}
