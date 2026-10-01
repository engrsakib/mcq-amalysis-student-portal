"use client";

import { ExamCarouselCard } from "@/components/dashboard/exam-carousel-card";
import { ExamListSlide } from "@/components/dashboard/exam-list-slide";
import { LiveIndicator } from "@/components/dashboard/live-indicator";
import { useLiveExams } from "@/hooks/use-live-exams";

export function LiveExamsCard() {
  const { exams, total, loading, error } = useLiveExams();
  const countLabel = Math.min(total, 20);

  return (
    <ExamCarouselCard
      title="Live"
      titleExtra={
        !loading && exams.length > 0 ? <LiveIndicator /> : undefined
      }
      countLabel={exams.length > 0 ? countLabel : undefined}
      loading={loading}
      error={error}
      exams={exams}
      emptyMessage="No live exam is currently available."
      renderSlide={(exam) => <ExamListSlide mode="live" exam={exam} />}
    />
  );
}
