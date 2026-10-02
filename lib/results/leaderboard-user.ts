import type { LeaderboardCurrentUser, LeaderboardEntry } from "@/lib/api/types";

export function isLeaderboardCheater(
  entry: Pick<LeaderboardEntry, "rank" | "is_cheated">
): boolean {
  if (entry.is_cheated === true) return true;
  if (typeof entry.rank === "string") {
    return entry.rank.trim().toLowerCase() === "cheater";
  }
  return false;
}

export function isLeaderboardParticipant(
  user: LeaderboardCurrentUser | null | undefined
): user is LeaderboardCurrentUser {
  if (user == null) return false;
  if (isLeaderboardCheater(user)) return true;
  return typeof user.rank === "number" && user.rank >= 1;
}

export function formatLeaderboardRank(rank: LeaderboardEntry["rank"]): string {
  return typeof rank === "number" ? String(rank) : rank.trim() || "—";
}

export function isNumericLeaderboardRank(
  rank: LeaderboardEntry["rank"]
): rank is number {
  return typeof rank === "number";
}
