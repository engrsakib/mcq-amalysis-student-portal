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
import { isLiveExam } from "@/lib/exam/previous-exams";

type LiveExamsContextValue = {
  exams: UserExam[];
  total: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const LiveExamsContext = createContext<LiveExamsContextValue | null>(null);

export function LiveExamsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [exams, setExams] = useState<UserExam[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = await getUserExams({
        page: 1,
        limit: 20,
        isLive: true,
      });
      const live = payload.data.filter((exam) => isLiveExam(exam));
      setExams(live);
      setTotal(payload.meta.total);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not load live exams.");
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

  const value = useMemo(
    () => ({ exams, total, loading, error, refresh }),
    [exams, total, loading, error, refresh]
  );

  return (
    <LiveExamsContext.Provider value={value}>{children}</LiveExamsContext.Provider>
  );
}

export function useLiveExams() {
  const ctx = useContext(LiveExamsContext);
  if (!ctx) {
    throw new Error("useLiveExams must be used within LiveExamsProvider");
  }
  return ctx;
}
