"use client";

import { usePathname } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { useProfileDisplay } from "@/components/dashboard/user-summary";
import { useUpcomingExams } from "@/hooks/use-upcoming-exams";

export function AppPageHeader() {
  const pathname = usePathname();
  const isExamSessionRoute = /^\/exam\/\d+/.test(pathname);
  const { name, loading: profileLoading } = useProfileDisplay();
  const { nearestExamDateLabel, loading: examsLoading } = useUpcomingExams();

  const examDate = nearestExamDateLabel ?? (examsLoading ? "…" : "—");

  return (
    <PageHeader
      studentName={profileLoading ? "Student" : name}
      examDate={examDate}
      hideSearch={isExamSessionRoute}
    />
  );
}
