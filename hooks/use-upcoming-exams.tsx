"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiError } from "@/lib/api/client";
import { getUpcomingExams } from "@/lib/api/exam";
import type { UpcomingExam } from "@/lib/api/types";
import { formatExamDateOnly } from "@/lib/datetime/format-exam";

function sortExamsByDateAsc(list: UpcomingExam[]) {
  return [...list].sort(
    (a, b) =>
      new Date(a.exam_date_time).getTime() -
      new Date(b.exam_date_time).getTime()
  );
}

type UpcomingExamsContextValue = {
  exams: UpcomingExam[];
  total: number;
  loading: boolean;
  error: string | null;
  nearestExamDateLabel: string | null;
  refresh: () => Promise<void>;
};

const UpcomingExamsContext = createContext<UpcomingExamsContextValue | null>(
  null
);

export function UpcomingExamsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [exams, setExams] = useState<UpcomingExam[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = await getUpcomingExams({ page: 1, limit: 10 });
      setExams(sortExamsByDateAsc(payload.data));
      setTotal(payload.meta.total);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not load upcoming exams.");
      }
      setExams([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const nearestExamDateLabel = useMemo(() => {
    if (exams.length === 0) return null;
    return formatExamDateOnly(exams[0]!.exam_date_time);
  }, [exams]);

  const value = useMemo(
    () => ({
      exams,
      total,
      loading,
      error,
      nearestExamDateLabel,
      refresh,
    }),
    [exams, total, loading, error, nearestExamDateLabel, refresh]
  );

  return (
    <UpcomingExamsContext.Provider value={value}>
      {children}
    </UpcomingExamsContext.Provider>
  );
}

export function useUpcomingExams() {
  const ctx = useContext(UpcomingExamsContext);
  if (!ctx) {
    throw new Error(
      "useUpcomingExams must be used within UpcomingExamsProvider"
    );
  }
  return ctx;
}
