"use client";

import { Award, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveIndicator } from "@/components/dashboard/live-indicator";
import { useExamBriefing } from "@/hooks/use-exam-briefing";
import { formatExamDateTime } from "@/lib/datetime/format-exam";
import type { UpcomingExam, UserExam } from "@/lib/api/types";
import type { ExamBriefingSource } from "@/lib/exam/briefing-mode";
import { cn } from "@/lib/utils";

type ExamListSlideProps =
  | {
      mode: "upcoming";
      exam: UpcomingExam;
    }
  | {
      mode: "previous";
      exam: UserExam;
    }
  | {
      mode: "live";
      exam: UserExam;
    };

type SlideVariant = "live" | "upcoming" | "previous";

const primaryCtaClass =
  "mt-auto h-11 w-full shrink-0 rounded-[10px] bg-primary px-3 text-sm font-medium hover:bg-primary-hover";

export function ExamListSlide(props: ExamListSlideProps) {
  const { openBriefing } = useExamBriefing();
  const exam = props.exam;
  const when = formatExamDateTime(exam.exam_date_time);
  const source: ExamBriefingSource = props.mode;

  const open = () => openBriefing(exam, source);

  if (props.mode === "live") {
    return (
      <ExamSlideShell variant="live">
        <ExamSlideBody exam={exam} when={when} liveNow />
        <Button
          type="button"
          title="Start exam"
          onClick={open}
          className={primaryCtaClass}
        >
          Start
        </Button>
      </ExamSlideShell>
    );
  }

  if (props.mode === "upcoming") {
    const canStart = exam.is_started;
    const buttonLabel = canStart ? "Start" : `Start on ${when}`;

    return (
      <ExamSlideShell variant="upcoming">
        <ExamSlideBody exam={exam} when={when} />
        <Button
          type="button"
          disabled={!canStart}
          title={canStart ? "Start exam" : buttonLabel}
          onClick={canStart ? open : undefined}
          className={cn(
            primaryCtaClass,
            !canStart && "cursor-not-allowed opacity-50 hover:bg-primary"
          )}
        >
          {buttonLabel}
        </Button>
      </ExamSlideShell>
    );
  }

  return (
    <ExamSlideShell variant="previous" submitted={props.exam.isSubmitted === true}>
      <ExamSlideBody exam={exam} when={when} submitted={props.exam.isSubmitted === true} />
      <Button
        type="button"
        variant="outline"
        title="Practice this exam"
        onClick={open}
        className="mt-auto h-11 w-full shrink-0 rounded-[10px] border-primary/40 bg-card text-sm font-medium text-primary hover:bg-primary-soft"
      >
        Practice
      </Button>
    </ExamSlideShell>
  );
}

function ExamSlideShell({
  variant,
  submitted,
  children,
}: {
  variant: SlideVariant;
  submitted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[220px] w-full min-w-0 flex-col gap-4 rounded-xl border p-4 shadow-sm sm:p-5",
        variant === "live" &&
          "border-primary/35 bg-gradient-to-br from-primary-soft/40 to-card ring-1 ring-primary/10",
        variant === "upcoming" && "border-line/80 bg-card",
        variant === "previous" &&
          "border-line/80 bg-card",
        variant === "previous" &&
          submitted &&
          "border-primary/20 bg-gradient-to-br from-primary-soft/15 to-card"
      )}
    >
      {children}
    </div>
  );
}

function ExamSlideBody({
  exam,
  when,
  submitted,
  liveNow,
}: {
  exam: UpcomingExam;
  when: string;
  submitted?: boolean;
  liveNow?: boolean;
}) {
  return (
    <div className="min-w-0 flex-1 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <span className="max-w-[70%] truncate rounded-lg bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">
          {exam.subject}
        </span>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
          {liveNow ? <LiveIndicator className="py-0.5 text-[10px]" /> : null}
          {submitted ? (
            <span className="rounded-lg bg-primary-soft/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Submitted
            </span>
          ) : null}
        </div>
      </div>

      <h3 className="line-clamp-3 text-base font-semibold leading-snug text-ink sm:line-clamp-2">
        {exam.exam_name}
      </h3>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2">
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <Calendar className="size-4 shrink-0 text-primary/70" aria-hidden />
          <span className="truncate font-medium text-ink/90">{when}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4 shrink-0 text-primary/70" aria-hidden />
          {exam.duration_minutes} min
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Award className="size-4 shrink-0 text-primary/70" aria-hidden />
          {exam.total_marks} marks
        </span>
      </div>
    </div>
  );
}
