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

type SubjectiveModelTestsContextValue = {
  exams: UserExam[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const SubjectiveModelTestsContext =
  createContext<SubjectiveModelTestsContextValue | null>(null);

export function SubjectiveModelTestsProvider({
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
      const payload = await getUserExams({
        page: 1,
        limit: 100,
        searchTerm: "",
        excludeSubject: "Model Test",
      });
      setExams(filterPreviousExams(payload.data, 5));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not load subjective model tests.");
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
    <SubjectiveModelTestsContext.Provider value={value}>
      {children}
    </SubjectiveModelTestsContext.Provider>
  );
}

export function useSubjectiveModelTests() {
  const ctx = useContext(SubjectiveModelTestsContext);
  if (!ctx) {
    throw new Error(
      "useSubjectiveModelTests must be used within SubjectiveModelTestsProvider"
    );
  }
  return ctx;
}
