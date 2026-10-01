import { Button } from "@/components/ui/button";
import { formatExamDateTime } from "@/lib/datetime/format-exam";
import type { UpcomingExam } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type UpcomingExamSlideProps = {
  exam: UpcomingExam;
  layout?: "row" | "slide";
};

export function UpcomingExamSlide({
  exam,
  layout = "row",
}: UpcomingExamSlideProps) {
  const when = formatExamDateTime(exam.exam_date_time);
  const canStart = exam.is_started;
  const buttonLabel = canStart ? "Start" : `Start on ${when}`;

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-xl border border-line/80 bg-primary-soft/20 p-3 sm:p-4",
        layout === "slide" && "min-h-[200px] w-full sm:min-h-[220px]",
        layout === "row" && "min-h-[140px]"
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        <p className="line-clamp-3 text-sm font-semibold leading-snug text-ink sm:line-clamp-2">
          {exam.exam_name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{exam.subject}</p>
        <p className="text-xs text-muted-foreground">
          {exam.duration_minutes} min · {exam.total_marks} marks
        </p>
      </div>
      <Button
        type="button"
        disabled={!canStart}
        title={canStart ? "Start exam" : buttonLabel}
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
