"use client";

import { ExamCarouselCard } from "@/components/dashboard/exam-carousel-card";
import { StudyPlanSlide } from "@/components/dashboard/study-plan-slide";
import { useUserStudyPlans } from "@/hooks/use-user-study-plans";

export function StudyPlanSection() {
  const { plans, loading, error } = useUserStudyPlans();

  return (
    <ExamCarouselCard
      title="Study plan"
      countLabel={plans.length > 0 ? plans.length : undefined}
      countSuffix="plan"
      loading={loading}
      error={error}
      exams={plans}
      emptyMessage="No study plans available."
      enableAutoSlide
      autoSlideMs={2000}
      loadingSkeletonClassName="aspect-video w-full"
      cardClassName="lg:min-h-0"
      renderSlide={(plan) => <StudyPlanSlide plan={plan} />}
    />
  );
}
