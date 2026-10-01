"use client";

import { Radio } from "lucide-react";
import { ExamCarouselCard } from "@/components/dashboard/exam-carousel-card";
import { ExamListSlide } from "@/components/dashboard/exam-list-slide";
import { LiveExamsEmptyState } from "@/components/dashboard/live-exams-empty-state";
import { LiveIndicator } from "@/components/dashboard/live-indicator";
import { useLiveExams } from "@/hooks/use-live-exams";

function LiveCardTitleExtra({
  loading,
  hasExams,
}: {
  loading: boolean;
  hasExams: boolean;
}) {
  if (loading) return null;
  if (hasExams) return <LiveIndicator />;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-line/90 bg-muted/20 px-2 py-1 text-xs font-medium text-muted-foreground">
      <Radio className="size-3 shrink-0 opacity-80" aria-hidden />
      Standby
    </span>
  );
}

export function LiveExamsCard() {
  const { exams, total, loading, error } = useLiveExams();
  const countLabel = Math.min(total, 20);

  return (
    <ExamCarouselCard
      title="Live"
      titleExtra={
        <LiveCardTitleExtra loading={loading} hasExams={exams.length > 0} />
      }
      countLabel={exams.length > 0 ? countLabel : undefined}
      loading={loading}
      error={error}
      exams={exams}
      emptyMessage="No live exam is currently available."
      emptyContent={<LiveExamsEmptyState />}
      renderSlide={(exam) => <ExamListSlide mode="live" exam={exam} />}
    />
  );
}
