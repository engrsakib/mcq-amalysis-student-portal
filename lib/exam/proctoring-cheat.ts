import type { ProctoringEventLocal } from "@/lib/api/types";

export const PROCTORING_CHEAT_THRESHOLD_MS = 15_000;

export function isCheatedFromEvents(
  events: ProctoringEventLocal[],
  thresholdMs = PROCTORING_CHEAT_THRESHOLD_MS
): boolean {
  for (const event of events) {
    if (!event.endedAt) continue;
    const away =
      new Date(event.endedAt).getTime() - new Date(event.at).getTime();
    if (away > thresholdMs) return true;
  }
  return false;
}
