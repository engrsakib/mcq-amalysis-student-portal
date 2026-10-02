"use client";

import { Radio } from "lucide-react";
import { ExamListSlide } from "@/components/dashboard/exam-list-slide";
import { LiveExamsEmptyState } from "@/components/dashboard/live-exams-empty-state";
import { LiveIndicator } from "@/components/dashboard/live-indicator";
import { useLiveExams } from "@/hooks/use-live-exams";
import { cn } from "@/lib/utils";

export function ExamsLiveSection() {
  const { exams, loading, error } = useLiveExams();

  return (
    <section className="min-w-0 space-y-4" aria-labelledby="exams-live-heading">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="exams-live-heading" className="text-lg font-semibold text-ink">
          Live
        </h2>
        {!loading && exams.length > 0 ? <LiveIndicator /> : null}
        {!loading && exams.length === 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-line/90 bg-muted/20 px-2 py-1 text-xs font-medium text-muted-foreground">
            <Radio className="size-3 shrink-0 opacity-80" aria-hidden />
            Standby
          </span>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : loading ? (
        <div className="flex gap-4 overflow-hidden">
          <div className="h-[220px] min-w-[min(100%,280px)] flex-1 animate-pulse rounded-xl bg-primary-soft/40 sm:min-w-[280px]" />
          <div className="hidden h-[220px] min-w-[280px] animate-pulse rounded-xl bg-primary-soft/30 sm:block" />
        </div>
      ) : exams.length === 0 ? (
        <LiveExamsEmptyState />
      ) : (
        <div
          className={cn(
            "flex gap-4 pb-1",
            "snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
            "sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible xl:grid-cols-3"
          )}
        >
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="w-[min(100%,280px)] shrink-0 snap-start sm:w-auto sm:min-w-0"
            >
              <ExamListSlide mode="live" exam={exam} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
