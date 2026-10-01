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
import { getUserExams } from "@/lib/api/exam";
import type { UserExam } from "@/lib/api/types";
import { filterPreviousExams } from "@/lib/exam/previous-exams";

type PreviousExamsContextValue = {
  exams: UserExam[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const PreviousExamsContext = createContext<PreviousExamsContextValue | null>(
  null
);

export function PreviousExamsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [exams, setExams] = useState<UserExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = await getUserExams({ page: 1, limit: 10 });
      setExams(filterPreviousExams(payload.data, 5));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not load previous exams.");
      }
      setExams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ exams, loading, error, refresh }),
    [exams, loading, error, refresh]
  );

  return (
    <PreviousExamsContext.Provider value={value}>
      {children}
    </PreviousExamsContext.Provider>
  );
}

export function usePreviousExams() {
  const ctx = useContext(PreviousExamsContext);
  if (!ctx) {
    throw new Error(
      "usePreviousExams must be used within PreviousExamsProvider"
    );
  }
  return ctx;
}
