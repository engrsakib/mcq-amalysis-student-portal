"use client";

import type { LeaderboardEntry } from "@/lib/api/types";
import { formatLeaderboardScore } from "@/lib/results/format-score";
import {
  formatLeaderboardRank,
  isLeaderboardCheater,
  isNumericLeaderboardRank,
} from "@/lib/results/leaderboard-user";
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
  const cheater = isLeaderboardCheater(entry);
  const rankLabel = formatLeaderboardRank(entry.rank);
  const numericRank = isNumericLeaderboardRank(entry.rank);

  return (
    <div
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-lg px-2 py-2 sm:px-3",
        cheater && highlight && "bg-destructive/5 ring-1 ring-destructive/25",
        !cheater && highlight && "bg-primary/5 ring-1 ring-primary/20",
        className
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full font-semibold",
          cheater
            ? "min-h-9 bg-destructive/10 px-2 text-xs text-destructive"
            : "size-9 bg-muted text-sm tabular-nums text-muted-foreground",
          !cheater && numericRank && "size-9"
        )}
        aria-hidden
      >
        {rankLabel}
      </span>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
          cheater
            ? "bg-destructive/10 text-destructive"
            : "bg-primary/10 text-primary"
        )}
        aria-hidden
      >
        {getInitials(name)}
      </span>
      <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
        {name}
      </p>
      <p
        className={cn(
          "shrink-0 text-sm font-semibold tabular-nums",
          cheater ? "text-destructive" : "text-primary"
        )}
      >
        {formatLeaderboardScore(entry.score)}
      </p>
    </div>
  );
}
