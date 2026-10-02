"use client";

import { BooksMultiCarousel } from "@/components/dashboard/books-multi-carousel";
import { ExamRoutineCard } from "@/components/dashboard/exam-routine-card";
import { useUserExamRoutines } from "@/hooks/use-user-exam-routines";

export function ExamRoutineSection() {
  const { routines, total, loading, error } = useUserExamRoutines();

  return (
    <BooksMultiCarousel
      title="Exam routine"
      countLabel={
        routines.length > 0 ? Math.min(total, routines.length) : undefined
      }
      countSuffix="routine"
      dotItemLabel="routine"
      mediaAspect="landscape"
      loading={loading}
      error={error}
      items={routines}
      emptyMessage="No exam routines available."
      autoSlideMs={3000}
      layout="full"
      fillEmptySlots
      emptySlotMessage="No routine yet"
      renderItem={(routine) => <ExamRoutineCard routine={routine} />}
    />
  );
}
