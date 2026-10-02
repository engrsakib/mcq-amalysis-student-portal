"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getUserStudyPlans } from "@/lib/api/study-plan";
import type { UserStudyPlanEntry } from "@/lib/api/types";

export function useUserStudyPlans(enabled = true) {
  const [plans, setPlans] = useState<UserStudyPlanEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = await getUserStudyPlans({ page: 1, limit: 5 });
      const active = payload.data.filter((p) => p.status === "active");
      setPlans(active);
      setTotal(payload.meta.total);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not load study plans.");
      }
      setPlans([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled || fetched) return;
    void refresh();
  }, [enabled, fetched, refresh]);

  return {
    plans,
    total,
    loading: enabled && !fetched ? true : loading,
    error,
    refresh,
    fetched,
  };
}
