"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getPersonalGrowth } from "@/lib/api/personal-growth";
import { ApiError } from "@/lib/api/client";
import type { PersonalGrowthTimePoint } from "@/lib/api/types";
import {
  buildPersonalGrowthView,
  type LastDaysSummary,
} from "@/lib/dashboard/personal-growth";

type PersonalGrowthContextValue = {
  lastThreeDays: PersonalGrowthTimePoint[];
  lastDaysSummary: LastDaysSummary;
  professionalGrade: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const PersonalGrowthContext = createContext<PersonalGrowthContextValue | null>(
  null
);

const emptySummary: LastDaysSummary = {
  totalAttempts: 0,
  averageTotalScore: 0,
  averageCorrectRate: 0,
};

export function PersonalGrowthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lastThreeDays, setLastThreeDays] = useState<PersonalGrowthTimePoint[]>(
    []
  );
  const [lastDaysSummary, setLastDaysSummary] =
    useState<LastDaysSummary>(emptySummary);
  const [professionalGrade, setProfessionalGrade] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = await getPersonalGrowth({ range: "last30" });
      const view = buildPersonalGrowthView(
        payload.timeSeries,
        payload.summary
      );
      setLastThreeDays(view.lastThreeDays);
      setLastDaysSummary(view.lastDaysSummary);
      setProfessionalGrade(view.professionalGrade);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not load personal growth.");
      }
      setLastThreeDays([]);
      setLastDaysSummary(emptySummary);
      setProfessionalGrade(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      lastThreeDays,
      lastDaysSummary,
      professionalGrade,
      loading,
      error,
      refresh,
    }),
    [
      lastThreeDays,
      lastDaysSummary,
      professionalGrade,
      loading,
      error,
      refresh,
    ]
  );

  return (
    <PersonalGrowthContext.Provider value={value}>
      {children}
    </PersonalGrowthContext.Provider>
  );
}

export function usePersonalGrowth() {
  const ctx = useContext(PersonalGrowthContext);
  if (!ctx) {
    throw new Error(
      "usePersonalGrowth must be used within PersonalGrowthProvider"
    );
  }
  return ctx;
}
