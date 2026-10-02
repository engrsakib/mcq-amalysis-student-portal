"use client";

import { ExternalLink } from "lucide-react";
import { ExamRoutineThumbnail } from "@/components/dashboard/exam-routine-thumbnail";
import { buttonVariants } from "@/components/ui/button";
import type { UserExamRoutineEntry } from "@/lib/api/types";
import { formatExamDateTime } from "@/lib/datetime/format-exam";
import { cn } from "@/lib/utils";

type ExamRoutineCardProps = {
  routine: UserExamRoutineEntry;
  className?: string;
};

export function ExamRoutineCard({ routine, className }: ExamRoutineCardProps) {
  const url = routine.exam_routine_url?.trim();
  const posted =
    routine.post_date?.trim() ?
      formatExamDateTime(routine.post_date)
    : null;

  return (
    <article
      className={cn(
        "flex h-full min-w-0 flex-col gap-3 rounded-xl border border-line/70 bg-card p-3 shadow-sm",
        className
      )}
    >
      <ExamRoutineThumbnail thumbnailUrl={routine.thumbnail_url} />

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">
          {routine.title}
        </h3>
        {posted ? (
          <p className="text-xs text-muted-foreground">Posted {posted}</p>
        ) : null}
      </div>

      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "inline-flex h-10 w-full gap-2 rounded-[10px] border-primary/40 px-4 text-sm font-medium text-primary hover:bg-primary-soft"
          )}
        >
          Open routine
          <ExternalLink className="size-4 shrink-0" aria-hidden />
        </a>
      ) : (
        <p className="text-sm text-muted-foreground">Link unavailable</p>
      )}
    </article>
  );
}
