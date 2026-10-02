"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getUserExamRoutines } from "@/lib/api/exam-routine";
import type { UserExamRoutineEntry } from "@/lib/api/types";

export function useUserExamRoutines() {
  const [routines, setRoutines] = useState<UserExamRoutineEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = await getUserExamRoutines({
        page: 1,
        limit: 5,
        searchTerm: "",
      });
      const active = payload.data.filter((r) => r.status === "active");
      setRoutines(active);
      setTotal(payload.meta.total);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not load exam routines.");
      }
      setRoutines([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { routines, total, loading, error, refresh };
}
