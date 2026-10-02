"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { useProfileDisplay } from "@/components/dashboard/user-summary";
import { useUpcomingExams } from "@/hooks/use-upcoming-exams";

export function AppPageHeader() {
  const { name, initials, loading: profileLoading } = useProfileDisplay();
  const { nearestExamDateLabel, loading: examsLoading } = useUpcomingExams();

  const examDate = nearestExamDateLabel ?? (examsLoading ? "…" : "—");

  return (
    <PageHeader
      studentName={profileLoading ? "Student" : name}
      examDate={examDate}
      initials={profileLoading ? "…" : initials}
    />
  );
}
