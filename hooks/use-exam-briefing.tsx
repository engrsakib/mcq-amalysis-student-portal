"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { UpcomingExam } from "@/lib/api/types";
import type { ExamBriefingSource } from "@/lib/exam/briefing-mode";

export type ExamBriefingState = {
  exam: UpcomingExam;
  source: ExamBriefingSource;
};

type ExamBriefingContextValue = {
  briefing: ExamBriefingState | null;
  openBriefing: (exam: UpcomingExam, source: ExamBriefingSource) => void;
  closeBriefing: () => void;
};

const ExamBriefingContext = createContext<ExamBriefingContextValue | null>(null);

export function ExamBriefingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [briefing, setBriefing] = useState<ExamBriefingState | null>(null);

  const openBriefing = useCallback(
    (exam: UpcomingExam, source: ExamBriefingSource) => {
      setBriefing({ exam, source });
    },
    []
  );

  const closeBriefing = useCallback(() => {
    setBriefing(null);
  }, []);

  const value = useMemo(
    () => ({ briefing, openBriefing, closeBriefing }),
    [briefing, openBriefing, closeBriefing]
  );

  return (
    <ExamBriefingContext.Provider value={value}>
      {children}
    </ExamBriefingContext.Provider>
  );
}

export function useExamBriefing() {
  const ctx = useContext(ExamBriefingContext);
  if (!ctx) {
    throw new Error(
      "useExamBriefing must be used within ExamBriefingProvider"
    );
  }
  return ctx;
}
