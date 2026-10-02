"use client";

import Link from "next/link";
import type { ActivityLogEntry } from "@/lib/api/types";
import {
  getActivityActionLabel,
  isActivityAlert,
} from "@/lib/activity/constants";
import { formatExamDateTime } from "@/lib/datetime/format-exam";
import { cn } from "@/lib/utils";

type ActivityLogItemProps = {
  entry: ActivityLogEntry;
  className?: string;
};

export function ActivityLogItem({ entry, className }: ActivityLogItemProps) {
  const alert = isActivityAlert(entry);
  const when = formatExamDateTime(entry.createdAt);
  const actionLabel = getActivityActionLabel(entry.action);
  const examNumber = entry.examNumber;

  return (
    <article
      className={cn(
        "rounded-xl border border-line/70 bg-card p-3 shadow-sm sm:p-4",
        "border-l-4",
        alert
          ? "border-l-danger bg-danger-soft/25"
          : "border-l-primary",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="min-w-0 flex-1 text-sm font-semibold text-ink sm:text-base">
          {entry.title}
        </h2>
        <span
          className={cn(
            "shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            alert
              ? "bg-danger-soft text-danger"
              : "bg-primary-soft text-primary"
          )}
        >
          {actionLabel}
        </span>
      </div>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {entry.description}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <time dateTime={entry.createdAt}>{when}</time>
        {examNumber != null && examNumber > 0 ? (
          <Link
            href={`/exam/${examNumber}`}
            className="font-medium text-primary hover:underline"
          >
            View exam
          </Link>
        ) : null}
      </div>
    </article>
  );
}
