"use client";

import { useCallback } from "react";
import { ApiError } from "@/lib/api/client";
import { getUserExamSolutions } from "@/lib/api/exam-solution";
import { EXAM_SOLUTION_CATALOG_LIMIT } from "@/lib/catalog/page-sizes";
import { usePaginatedCatalog } from "@/hooks/use-paginated-catalog";

export function usePaginatedExamSolutions(enabled: boolean) {
  const fetchPage = useCallback(async (page: number, searchTerm: string) => {
    try {
      const payload = await getUserExamSolutions({
        page,
        limit: EXAM_SOLUTION_CATALOG_LIMIT,
        searchTerm,
      });
      return { data: payload.data, meta: payload.meta };
    } catch (err) {
      if (err instanceof ApiError) {
        throw new Error(err.errorMessages?.[0]?.message || err.message);
      }
      throw new Error("Could not load model test solutions.");
    }
  }, []);

  return usePaginatedCatalog({
    enabled,
    fetchPage,
    errorMessage: "Could not load model test solutions.",
  });
}
