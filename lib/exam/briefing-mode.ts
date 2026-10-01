import type { UpcomingExam } from "@/lib/api/types";

export type ExamBriefingSource = "upcoming" | "live" | "previous";

export function getExamModeLabel(
  exam: UpcomingExam,
  source: ExamBriefingSource
): string {
  if (source === "previous" || exam.is_practice_mode === true) {
    return "Practice";
  }
  if (source === "live" || (source === "upcoming" && exam.is_started)) {
    return "Live / Official";
  }
  return "Scheduled / Official";
}

export function getBriefingPrimaryLabel(source: ExamBriefingSource): string {
  return source === "previous" ? "Start practice" : "Start Exam";
}

/** MCQ exams often use one mark per question when count is omitted from API. */
export function getQuestionCount(exam: UpcomingExam): number {
  return exam.total_marks;
}
