"use client";

import { Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExamBriefing } from "@/hooks/use-exam-briefing";
import { formatExamDateTime } from "@/lib/datetime/format-exam";
import type { UserExam } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type ExamListRowProps = {
  exam: UserExam;
  className?: string;
};

export function ExamListRow({ exam, className }: ExamListRowProps) {
  const { openBriefing } = useExamBriefing();
  const when = formatExamDateTime(exam.exam_date_time);
  const submitted = exam.isSubmitted === true;

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-line/80 border-l-4 border-l-primary bg-card px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:gap-4",
        className
      )}
    >
      <div className="min-w-0 flex-1">
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

        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-ink sm:line-clamp-1">
          {exam.exam_name}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0 text-primary" aria-hidden />
            <span className="truncate">{when}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm">
            <Award className="size-3.5 shrink-0 text-primary" aria-hidden />
            <span>
              {exam.total_marks} marks · {exam.duration_minutes} min
            </span>
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-10 w-full shrink-0 rounded-[10px] border-primary/40 text-sm font-medium text-primary hover:bg-primary-soft sm:w-[120px]"
        title="Practice this exam"
        onClick={() => openBriefing(exam, "previous")}
      >
        Practice
      </Button>
    </article>
  );
}

export function ExamListRowSkeleton() {
  return (
    <div
      className="h-[72px] animate-pulse rounded-xl border border-line/60 bg-card px-4 py-3"
      aria-hidden
    >
      <div className="flex h-full flex-col justify-center gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-primary-soft/80" />
          <div className="h-4 w-3/4 max-w-md rounded bg-primary-soft/60" />
        </div>
        <div className="hidden h-10 w-[120px] rounded-[10px] bg-primary-soft/40 sm:block" />
      </div>
    </div>
  );
}
