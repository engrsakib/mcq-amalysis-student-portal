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

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-line/80 bg-primary-soft/20 p-4",
        layout === "slide" && "min-h-[220px] w-full shrink-0 snap-center",
        layout === "row" && "sm:flex-row sm:items-center sm:justify-between"
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        <p className="line-clamp-2 text-sm font-semibold text-ink">
          {exam.exam_name}
        </p>
        <p className="text-xs text-muted-foreground">{exam.subject}</p>
        <p className="text-xs font-medium text-primary">{when}</p>
        <p className="text-xs text-muted-foreground">
          {exam.duration_minutes} min · {exam.total_marks} marks
        </p>
      </div>
      <Button
        type="button"
        disabled={!canStart}
        title={canStart ? "Start exam" : `Starts at ${when}`}
        className={cn(
          "h-10 shrink-0 px-6",
          canStart
            ? "bg-primary hover:bg-primary-hover"
            : "cursor-not-allowed opacity-50"
        )}
      >
        Start
      </Button>
    </div>
  );
}
