"use client";

import { Star } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/api/types";
import { formatLeaderboardScore } from "@/lib/results/format-score";
import { getInitials } from "@/lib/user/display";
import { cn } from "@/lib/utils";

type PodiumSlotProps = {
  rank: 1 | 2 | 3;
  entry: LeaderboardEntry | null;
};

const slotStyles: Record<
  1 | 2 | 3,
  { avatar: string; block: string; label: string }
> = {
  1: {
    avatar: "border-amber-400 bg-amber-50 text-amber-700 ring-amber-200",
    block: "h-24 bg-amber-400/90 sm:h-28",
    label: "text-amber-600",
  },
  2: {
    avatar: "border-line bg-primary-soft/40 text-muted-foreground",
    block: "h-16 bg-line/80 sm:h-[4.5rem]",
    label: "text-muted-foreground",
  },
  3: {
    avatar: "border-amber-700/40 bg-amber-950/5 text-amber-900",
    block: "h-14 bg-amber-700/30 sm:h-16",
    label: "text-amber-800/80",
  },
};

function PodiumSlot({ rank, entry }: PodiumSlotProps) {
  const styles = slotStyles[rank];
  const name = entry?.student_name?.trim() || "—";
  const isFirst = rank === 1;

  return (
    <div className="flex min-w-0 flex-col items-center gap-2 pt-2">
      <div className="relative">
        <div
          className={cn(
            "flex size-14 items-center justify-center rounded-full border-2 text-sm font-semibold sm:size-16",
            entry ? styles.avatar : "border-dashed border-line bg-muted/30 text-muted-foreground"
          )}
        >
          {entry ? getInitials(name) : "—"}
        </div>
        {isFirst && entry ? (
          <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-sm">
            <Star className="size-3.5 fill-current" aria-hidden />
          </span>
        ) : null}
      </div>
      <p className="max-w-full truncate px-1 text-center text-xs font-medium text-foreground sm:text-sm">
        {entry ? name : "Open"}
      </p>
      {entry ? (
        <p className="text-sm font-semibold tabular-nums text-primary">
          {formatLeaderboardScore(entry.score)}
        </p>
      ) : (
        <p className={cn("text-xs font-semibold tabular-nums", styles.label)}>
          #{rank}
        </p>
      )}
      <div
        className={cn(
          "mt-1 w-full rounded-t-lg",
          entry ? styles.block : "h-12 bg-muted/40"
        )}
        aria-hidden
      >
        <p
          className={cn(
            "pt-2 text-center text-lg font-bold tabular-nums sm:text-xl",
            styles.label
          )}
        >
          {rank}
        </p>
      </div>
    </div>
  );
}

type LeaderboardPodiumProps = {
  topThree: LeaderboardEntry[];
  className?: string;
};

function entryForRank(
  topThree: LeaderboardEntry[],
  rank: 1 | 2 | 3
): LeaderboardEntry | null {
  return topThree.find((e) => e.rank === rank) ?? null;
}

export function LeaderboardPodium({ topThree, className }: LeaderboardPodiumProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 items-end gap-2 px-1 sm:gap-4 sm:px-4",
        className
      )}
      aria-label="Top three"
    >
      <PodiumSlot rank={2} entry={entryForRank(topThree, 2)} />
      <PodiumSlot rank={1} entry={entryForRank(topThree, 1)} />
      <PodiumSlot rank={3} entry={entryForRank(topThree, 3)} />
    </div>
  );
}

export function LeaderboardPodiumSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 items-end gap-2 px-1 sm:gap-4 sm:px-4",
        className
      )}
      aria-hidden
    >
      {[2, 1, 3].map((rank) => (
        <div key={rank} className="flex flex-col items-center gap-2">
          <div className="size-14 animate-pulse rounded-full bg-muted sm:size-16" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          <div
            className={cn(
              "mt-1 w-full animate-pulse rounded-t-lg bg-muted",
              rank === 1 ? "h-24 sm:h-28" : rank === 2 ? "h-16" : "h-14"
            )}
          />
        </div>
      ))}
    </div>
  );
}
