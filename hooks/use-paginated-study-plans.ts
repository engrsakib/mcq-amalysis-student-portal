"use client";

import { useCallback } from "react";
import { ApiError } from "@/lib/api/client";
import { getUserStudyPlans } from "@/lib/api/study-plan";
import { STUDY_PLAN_CATALOG_LIMIT } from "@/lib/catalog/page-sizes";
import { usePaginatedCatalog } from "@/hooks/use-paginated-catalog";

export function usePaginatedStudyPlans(enabled: boolean) {
  const fetchPage = useCallback(async (page: number, searchTerm: string) => {
    try {
      const payload = await getUserStudyPlans({
        page,
        limit: STUDY_PLAN_CATALOG_LIMIT,
        searchTerm,
      });
      return { data: payload.data, meta: payload.meta };
    } catch (err) {
      if (err instanceof ApiError) {
        throw new Error(err.errorMessages?.[0]?.message || err.message);
      }
      throw new Error("Could not load study plans.");
    }
  }, []);

  return usePaginatedCatalog({
    enabled,
    fetchPage,
    errorMessage: "Could not load study plans.",
  });
}
