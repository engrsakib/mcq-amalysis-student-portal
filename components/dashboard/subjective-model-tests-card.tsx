"use client";

import { ExamCarouselCard } from "@/components/dashboard/exam-carousel-card";
import { ExamListSlide } from "@/components/dashboard/exam-list-slide";
import { useSubjectiveModelTests } from "@/hooks/use-subjective-model-tests";

export function SubjectiveModelTestsCard() {
  const { exams, loading, error } = useSubjectiveModelTests();

  return (
    <ExamCarouselCard
      title="Subjective Model Test"
      countLabel={exams.length}
      loading={loading}
      error={error}
      exams={exams}
      emptyMessage="No subjective model tests."
      renderSlide={(exam) => (
        <ExamListSlide mode="previous" exam={exam} />
      )}
    />
  );
}
