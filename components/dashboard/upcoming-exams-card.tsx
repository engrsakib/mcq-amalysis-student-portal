"use client";

import { ExamCarouselCard } from "@/components/dashboard/exam-carousel-card";
import { ExamListSlide } from "@/components/dashboard/exam-list-slide";
import { useUpcomingExams } from "@/hooks/use-upcoming-exams";

export function UpcomingExamsCard() {
  const { exams, total, loading, error } = useUpcomingExams();
  const countLabel = Math.min(total, 10);

  return (
    <ExamCarouselCard
      title="Upcoming"
      countLabel={countLabel}
      loading={loading}
      error={error}
      exams={exams}
      emptyMessage="No upcoming exams."
      renderSlide={(exam) => (
        <ExamListSlide mode="upcoming" exam={exam} />
      )}
    />
  );
}
