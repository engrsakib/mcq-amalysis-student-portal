"use client";

import { Button } from "@/components/ui/button";
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

export function ExamListSlide(props: ExamListSlideProps) {
  const { openBriefing } = useExamBriefing();
  const exam = props.exam;
  const when = formatExamDateTime(exam.exam_date_time);
  const source: ExamBriefingSource = props.mode;

  const open = () => openBriefing(exam, source);

  if (props.mode === "live") {
    return (
      <div className="flex min-h-[200px] w-full min-w-0 flex-col gap-3 rounded-xl border border-primary/40 bg-primary-soft/20 p-3 sm:min-h-[220px] sm:p-4">
        <ExamSlideBody exam={exam} when={when} liveNow />
        <Button
          type="button"
          title="Start exam"
          onClick={open}
          className="mt-auto h-auto min-h-10 w-full shrink-0 bg-primary px-3 py-2.5 text-xs leading-snug whitespace-normal hover:bg-primary-hover sm:text-sm"
        >
          Start
        </Button>
      </div>
    );
  }

  if (props.mode === "upcoming") {
    const canStart = exam.is_started;
    const buttonLabel = canStart ? "Start" : `Start on ${when}`;

    return (
      <div className="flex min-h-[200px] w-full min-w-0 flex-col gap-3 rounded-xl border border-line/80 bg-primary-soft/20 p-3 sm:min-h-[220px] sm:p-4">
        <ExamSlideBody exam={exam} when={when} />
        <Button
          type="button"
          disabled={!canStart}
          title={canStart ? "Start exam" : buttonLabel}
          onClick={canStart ? open : undefined}
          className={cn(
            "mt-auto h-auto min-h-10 w-full shrink-0 px-3 py-2.5 text-xs leading-snug whitespace-normal sm:text-sm",
            canStart
              ? "bg-primary hover:bg-primary-hover"
              : "cursor-not-allowed opacity-50"
          )}
        >
          {buttonLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[200px] w-full min-w-0 flex-col gap-3 rounded-xl border border-line/80 bg-primary-soft/20 p-3 sm:min-h-[220px] sm:p-4">
      <ExamSlideBody
        exam={exam}
        when={when}
        submitted={props.exam.isSubmitted === true}
      />
      <Button
        type="button"
        variant="outline"
        title="Practice this exam"
        onClick={open}
        className="mt-auto h-auto min-h-10 w-full shrink-0 border-primary/30 bg-card px-3 py-2.5 text-xs leading-snug whitespace-normal text-primary hover:bg-primary-soft sm:text-sm"
      >
        Practice
      </Button>
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
    <div className="min-w-0 flex-1 space-y-1">
      <p className="line-clamp-3 text-sm font-semibold leading-snug text-ink sm:line-clamp-2">
        {exam.exam_name}
      </p>
      <p className="truncate text-xs text-muted-foreground">{exam.subject}</p>
      <p className="text-xs font-medium text-primary">{when}</p>
      {liveNow ? (
        <p className="text-xs font-medium text-danger">Live now</p>
      ) : null}
      <p className="text-xs text-muted-foreground">
        {exam.duration_minutes} min · {exam.total_marks} marks
      </p>
      {submitted ? (
        <p className="text-xs text-muted-foreground">Submitted</p>
      ) : null}
    </div>
  );
}
