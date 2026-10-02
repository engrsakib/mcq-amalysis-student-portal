"use client";

import { LeaderboardParticipantRow } from "@/components/results/leaderboard-participant-row";
import type { LeaderboardCurrentUser, LeaderboardEntry } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type LeaderboardYourRankProps = {
  currentUser: LeaderboardCurrentUser;
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
  const onPodium = isOnPodium(currentUser, topThree);
  if (currentUser.rank <= 3 && onPodium) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Your position
      </p>
      <LeaderboardParticipantRow entry={currentUser} highlight />
    </div>
  );
}
