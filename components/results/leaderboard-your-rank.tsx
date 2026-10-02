"use client";

import { LeaderboardParticipantRow } from "@/components/results/leaderboard-participant-row";
import type { LeaderboardCurrentUser, LeaderboardEntry } from "@/lib/api/types";
import {
  isLeaderboardParticipant,
  isNumericLeaderboardRank,
} from "@/lib/results/leaderboard-user";
import { cn } from "@/lib/utils";

type LeaderboardYourRankProps = {
  currentUser: LeaderboardCurrentUser | null;
  topThree: LeaderboardEntry[];
  className?: string;
};

function isOnPodium(
  user: LeaderboardCurrentUser,
  topThree: LeaderboardEntry[]
): boolean {
  return topThree.some(
    (e) => e.rank === user.rank && e.student_name === user.student_name
  );
}

export function LeaderboardYourRank({
  currentUser,
  topThree,
  className,
}: LeaderboardYourRankProps) {
  const participated = isLeaderboardParticipant(currentUser);

  if (
    participated &&
    isNumericLeaderboardRank(currentUser.rank) &&
    currentUser.rank <= 3 &&
    isOnPodium(currentUser, topThree)
  ) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Your position
      </p>
      {participated ? (
        <LeaderboardParticipantRow entry={currentUser} highlight />
      ) : (
        <div className="rounded-lg border border-dashed border-line bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
          You did not participate in this exam.
        </div>
      )}
    </div>
  );
}
