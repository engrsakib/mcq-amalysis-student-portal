"use client";

import { ExamCarouselCard } from "@/components/dashboard/exam-carousel-card";
import { ExamListSlide } from "@/components/dashboard/exam-list-slide";
import { usePreviousExams } from "@/hooks/use-previous-exams";

export function PreviousExamsCard() {
  const { exams, loading, error } = usePreviousExams();

  return (
    <ExamCarouselCard
      title="Previous"
      countLabel={exams.length}
      loading={loading}
      error={error}
      exams={exams}
      emptyMessage="No previous exams."
      renderSlide={(exam) => (
        <ExamListSlide mode="previous" exam={exam} />
      )}
    />
  );
}
