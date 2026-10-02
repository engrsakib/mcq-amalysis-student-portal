"use client";

import { useCallback, useEffect, useState } from "react";
import { getUserExams } from "@/lib/api/exam";
import { ApiError } from "@/lib/api/client";
import type { UserExam } from "@/lib/api/types";
import { formatExamDateOnly } from "@/lib/datetime/format-exam";
import { RESULTS_EXAM_OPTIONS_LIMIT } from "@/lib/results/constants";

export type ResultsExamOption = {
  examNumber: number;
  label: string;
  exam: UserExam;
};

function buildExamOptionLabel(exam: UserExam): string {
  const name = exam.exam_name?.trim() || `Exam #${exam.exam_number}`;
  const parts: string[] = [name];
  const subject = exam.subject?.trim();
  if (subject) parts.push(subject);
  try {
    const date = formatExamDateOnly(exam.exam_date_time);
    if (date) parts.push(date);
  } catch {
    /* ignore invalid dates */
  }
  return parts.join(" · ");
}

export function useResultsExamOptions() {
  const [exams, setExams] = useState<UserExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = await getUserExams({
        page: 1,
        limit: RESULTS_EXAM_OPTIONS_LIMIT,
      });
      setExams(payload.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not load exams.");
      }
      setExams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchExams();
  }, [fetchExams]);

  const options: ResultsExamOption[] = exams.map((exam) => ({
    examNumber: exam.exam_number,
    label: buildExamOptionLabel(exam),
    exam,
  }));

  return {
    exams,
    options,
    loading,
    error,
    retry: fetchExams,
  };
}
