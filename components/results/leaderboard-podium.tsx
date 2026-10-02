"use client";

import type { LeaderboardEntry } from "@/lib/api/types";
import { formatLeaderboardScoreValue } from "@/lib/results/format-score";
import { isLeaderboardCheater } from "@/lib/results/leaderboard-user";
import { getInitials } from "@/lib/user/display";
import { cn } from "@/lib/utils";

type PodiumSlotProps = {
  rank: 1 | 2 | 3;
  entry: LeaderboardEntry | null;
};

const rankTheme: Record<
  1 | 2 | 3,
  {
    slot: string;
    avatarSize: string;
    ring: string;
    fill: string;
    diamond: string;
    diamondText: string;
  }
> = {
  1: {
    slot: "z-[2] -mt-4 sm:-mt-6",
    avatarSize: "size-20 sm:size-[5.5rem] text-lg sm:text-xl",
    ring: "ring-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.35)]",
    fill: "bg-gradient-to-br from-amber-50 to-amber-100/80 text-amber-900",
    diamond: "bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600",
    diamondText: "text-white",
  },
  2: {
    slot: "z-[1]",
    avatarSize: "size-[4.5rem] sm:size-20 text-base sm:text-lg",
    ring: "ring-slate-300",
    fill: "bg-gradient-to-br from-violet-100 to-violet-200/90 text-violet-800",
    diamond: "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500",
    diamondText: "text-slate-700",
  },
  3: {
    slot: "z-[1]",
    avatarSize: "size-[4.5rem] sm:size-20 text-base sm:text-lg",
    ring: "ring-amber-700/70",
    fill: "bg-gradient-to-br from-orange-50 to-amber-100/90 text-amber-950",
    diamond: "bg-gradient-to-br from-orange-300 via-amber-600 to-amber-900",
    diamondText: "text-white",
  },
};

function PodiumRankDiamond({
  rank,
  className,
  diamondClass,
  textClass,
}: {
  rank: 1 | 2 | 3;
  className?: string;
  diamondClass: string;
  textClass: string;
}) {
  return (
    <div
      className={cn(
        "absolute -bottom-2 left-1/2 z-20 flex size-7 -translate-x-1/2 rotate-45 items-center justify-center rounded-sm shadow-md sm:size-8",
        diamondClass,
        className
      )}
      aria-hidden
    >
      <span
        className={cn(
          "-rotate-45 text-xs font-bold tabular-nums sm:text-sm",
          textClass
        )}
      >
        {rank}
      </span>
    </div>
  );
}

function PodiumSlot({ rank, entry }: PodiumSlotProps) {
  const theme = rankTheme[rank];
  const name = entry?.student_name?.trim() || "—";
  const cheater = entry ? isLeaderboardCheater(entry) : false;
  const filled = entry != null;

  return (
    <article
      className={cn(
        "relative flex min-w-0 flex-col items-center pb-2 pt-0",
        theme.slot
      )}
    >
      <div className="relative mb-5 flex justify-center sm:mb-6">
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full font-semibold ring-[3px] ring-offset-2 ring-offset-card",
            theme.avatarSize,
            filled
              ? cheater
                ? "bg-destructive/10 text-destructive ring-destructive"
                : cn(theme.fill, theme.ring)
              : "border border-dashed border-line bg-muted/40 text-muted-foreground ring-transparent"
          )}
        >
          {filled ? getInitials(name) : "—"}
        </div>
        {filled && !cheater ? (
          <PodiumRankDiamond
            rank={rank}
            diamondClass={theme.diamond}
            textClass={theme.diamondText}
          />
        ) : null}
        {filled && cheater ? (
          <PodiumRankDiamond
            rank={rank}
            diamondClass="bg-gradient-to-br from-red-400 to-red-700"
            textClass="text-white"
          />
        ) : null}
        {!filled ? (
          <PodiumRankDiamond
            rank={rank}
            diamondClass="bg-muted"
            textClass="text-muted-foreground"
          />
        ) : null}
      </div>

      <p
        className={cn(
          "max-w-full truncate px-1 text-center text-sm font-bold text-ink sm:text-base",
          !filled && "font-medium text-muted-foreground"
        )}
      >
        {filled ? name : "Open"}
      </p>

      {filled ? (
        <p
          className={cn(
            "mt-1 text-sm tabular-nums text-muted-foreground",
            cheater && "text-destructive/80"
          )}
        >
          {formatLeaderboardScoreValue(entry.score)}
        </p>
      ) : (
        <p className="mt-1 text-xs text-muted-foreground">—</p>
      )}
    </article>
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
        "grid grid-cols-3 items-end gap-2 sm:gap-4 md:gap-5",
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

const skeletonSizes: Record<number, string> = {
  1: "size-20 sm:size-[5.5rem] -mt-4 sm:-mt-6",
  2: "size-[4.5rem] sm:size-20",
  3: "size-[4.5rem] sm:size-20",
};

export function LeaderboardPodiumSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 items-end gap-2 sm:gap-4 md:gap-5",
        className
      )}
      aria-hidden
    >
      {[2, 1, 3].map((rank) => (
        <div
          key={rank}
          className={cn(
            "flex animate-pulse flex-col items-center pb-2",
            rank === 1 && "z-[2]"
          )}
        >
          <div className="relative mb-5 sm:mb-6">
            <div
              className={cn(
                "rounded-full bg-muted",
                skeletonSizes[rank]
              )}
            />
            <div className="absolute -bottom-2 left-1/2 size-7 -translate-x-1/2 rotate-45 rounded-sm bg-muted sm:size-8" />
          </div>
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="mt-2 h-3.5 w-10 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
