"use client";

import { Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExamBriefing } from "@/hooks/use-exam-briefing";
import { formatExamDateTime } from "@/lib/datetime/format-exam";
import type { UpcomingExam, UserExam } from "@/lib/api/types";
import {
  getBriefingPrimaryLabel,
  type ExamBriefingSource,
} from "@/lib/exam/briefing-mode";
import { cn } from "@/lib/utils";

type ExamGridCardProps = {
  exam: UserExam | UpcomingExam;
  briefingSource?: ExamBriefingSource;
  className?: string;
};

export function ExamGridCard({
  exam,
  briefingSource = "previous",
  className,
}: ExamGridCardProps) {
  const { openBriefing } = useExamBriefing();
  const userExam = exam as UserExam;
  const when = formatExamDateTime(exam.exam_date_time);
  const submitted = userExam.isSubmitted === true;
  const actionLabel =
    briefingSource === "previous"
      ? "Practice"
      : getBriefingPrimaryLabel(briefingSource);

  return (
    <article
      className={cn(
        "flex min-h-[220px] touch-pan-y flex-col overflow-hidden rounded-xl border border-line/80 border-l-4 border-l-primary bg-card shadow-sm",
        className
      )}
    >
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-lg border border-primary/40 bg-card px-2 py-0.5 font-medium text-primary">
            {exam.subject}
          </span>
          <span className="text-muted-foreground">Exam #{exam.exam_number}</span>
          {submitted ? (
            <span className="rounded-lg bg-primary-soft px-2 py-0.5 font-medium text-primary">
              Submitted
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-ink">
          {exam.exam_name}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft">
            <Calendar className="size-3.5 text-primary" aria-hidden />
          </span>
          <span className="min-w-0 truncate">{when}</span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Award className="size-3.5 shrink-0 text-primary" aria-hidden />
          <span>
            {exam.total_marks} marks · {exam.duration_minutes} min
          </span>
        </div>
      </div>

      <div className="border-t border-line px-4 py-3">
        <Button
          type="button"
          variant="outline"
          className="pressable h-11 w-full touch-pan-y rounded-[10px] border-primary/40 text-sm font-medium text-primary hover:bg-primary-soft"
          title={actionLabel}
          onClick={() => openBriefing(exam, briefingSource)}
        >
          {actionLabel}
        </Button>
      </div>
    </article>
  );
}

export function ExamGridCardSkeleton() {
  return (
    <div
      className="min-h-[220px] animate-pulse rounded-xl border border-line/60 bg-card p-4"
      aria-hidden
    >
      <div className="h-4 w-24 rounded bg-primary-soft/80" />
      <div className="mt-4 h-5 w-full rounded bg-primary-soft/60" />
      <div className="mt-2 h-5 w-3/4 rounded bg-primary-soft/60" />
      <div className="mt-6 h-4 w-32 rounded bg-primary-soft/50" />
      <div className="mt-8 h-10 w-full rounded-lg bg-primary-soft/40" />
    </div>
  );
}
