"use client";

import { Award, Calendar } from "lucide-react";
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
  "h-11 w-full shrink-0 rounded-[10px] bg-primary px-3 text-sm font-medium hover:bg-primary-hover";

const practiceCtaClass =
  "h-11 w-full shrink-0 rounded-[10px] border-primary/40 bg-card text-sm font-medium text-primary hover:bg-primary-soft";

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
        <ExamSlideFooter>
          <Button
            type="button"
            title="Start exam"
            onClick={open}
            className={primaryCtaClass}
          >
            Start
          </Button>
        </ExamSlideFooter>
      </ExamSlideShell>
    );
  }

  if (props.mode === "upcoming") {
    const canStart = exam.is_started;
    const buttonLabel = canStart ? "Start" : `Start on ${when}`;

    return (
      <ExamSlideShell variant="upcoming">
        <ExamSlideBody exam={exam} when={when} />
        <ExamSlideFooter>
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
        </ExamSlideFooter>
      </ExamSlideShell>
    );
  }

  return (
    <ExamSlideShell variant="previous">
      <ExamSlideBody
        exam={exam}
        when={when}
        submitted={props.exam.isSubmitted === true}
      />
      <ExamSlideFooter>
        <Button
          type="button"
          variant="outline"
          title="Practice this exam"
          onClick={open}
          className={practiceCtaClass}
        >
          Practice
        </Button>
      </ExamSlideFooter>
    </ExamSlideShell>
  );
}

function ExamSlideShell({
  variant,
  children,
}: {
  variant: SlideVariant;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[220px] w-full min-w-0 flex-col overflow-hidden rounded-xl border border-line/80 border-l-4 border-l-primary bg-card p-0 shadow-sm",
        variant === "live" && "ring-1 ring-primary/10"
      )}
    >
      {children}
    </div>
  );
}

function ExamSlideFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-auto border-t border-line px-4 py-3 sm:px-5">{children}</div>
  );
}

function MetaIconWell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft"
      aria-hidden
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
    <>
      <div className="flex items-start justify-between gap-2 border-b border-line px-4 pb-3 pt-4 sm:px-5">
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs">
          <span className="shrink-0 rounded-lg border border-primary/40 bg-card px-2.5 py-0.5 font-medium text-primary">
            {exam.subject}
          </span>
          <span className="hidden text-line sm:inline" aria-hidden>
            |
          </span>
          <span className="truncate text-muted-foreground">
            Exam #{exam.exam_number}
          </span>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
          {liveNow ? <LiveIndicator className="py-0.5 text-[10px]" /> : null}
          {submitted ? (
            <span className="rounded-lg bg-primary-soft/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Submitted
            </span>
          ) : null}
        </div>
      </div>

      <div className="min-w-0 flex-1 px-4 py-3 sm:px-5">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-ink">
          {exam.exam_name}
        </h3>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-primary-soft/60 px-2 py-0.5 text-xs font-medium text-primary">
            {exam.duration_minutes} min
          </span>
          <span className="rounded-md bg-primary-soft/60 px-2 py-0.5 text-xs font-medium text-primary">
            {exam.total_marks} marks
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <MetaIconWell>
              <Calendar className="size-4 text-primary" strokeWidth={2} />
            </MetaIconWell>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{when}</p>
              <p className="text-xs text-muted-foreground">Exam date</p>
            </div>
          </div>
          <div className="flex min-w-0 items-start gap-2.5">
            <MetaIconWell>
              <Award className="size-4 text-primary" strokeWidth={2} />
            </MetaIconWell>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">
                {exam.duration_minutes} min · {exam.total_marks} marks
              </p>
              <p className="text-xs text-muted-foreground">Duration & marks</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
