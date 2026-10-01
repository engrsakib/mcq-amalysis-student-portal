import type { UserExam } from "@/lib/api/types";

export function isLiveExam(exam: UserExam): boolean {
  if (exam.isLive === true) return true;
  return exam.is_started === true && exam.is_completed === false;
}

export function isPreviousExam(exam: UserExam, nowMs = Date.now()): boolean {
  if (isLiveExam(exam)) return false;
  if (exam.is_completed) return true;
  return new Date(exam.exam_date_time).getTime() < nowMs;
}

export function filterPreviousExams(exams: UserExam[], max = 5): UserExam[] {
  return exams
    .filter((exam) => isPreviousExam(exam))
    .sort(
      (a, b) =>
        new Date(b.exam_date_time).getTime() -
        new Date(a.exam_date_time).getTime()
    )
    .slice(0, max);
}
