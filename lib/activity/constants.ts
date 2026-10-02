import type { ActivityActionSlug, ActivityLogEntry } from "@/lib/api/types";

export const ACTIVITY_PAGE_LIMIT = 20;

export type ActivityActionFilterValue = "" | ActivityActionSlug;

export const ACTIVITY_ACTION_FILTERS: {
  value: ActivityActionFilterValue;
  label: string;
}[] = [
  { value: "", label: "All actions" },
  { value: "exam_started", label: "Exam started" },
  { value: "exam_submitted", label: "Exam submitted" },
  { value: "offline_submit", label: "Offline submit" },
  { value: "cheated_submit", label: "Cheated submit" },
  { value: "proctoring", label: "Proctoring" },
];

const ALERT_ACTIONS = new Set<string>(["cheated_submit", "proctoring"]);

export function getActivityActionLabel(action: string): string {
  const match = ACTIVITY_ACTION_FILTERS.find((f) => f.value === action);
  return match?.label ?? action.replace(/_/g, " ");
}

export function isActivityAlert(entry: ActivityLogEntry): boolean {
  if (ALERT_ACTIONS.has(entry.action)) return true;
  if (entry.severity && entry.severity !== "normal") return true;
  return false;
}
