"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getUpcomingExams, getUserExams } from "@/lib/api/exam";
import type { PaginatedMeta, UpcomingExam, UserExam } from "@/lib/api/types";
import { isPreviousExam } from "@/lib/exam/previous-exams";

export type ExamCatalogVariant = "previous" | "subjective" | "upcoming";

export const EXAM_CATALOG_PAGE_SIZE = 12;

const SEARCH_DEBOUNCE_MS = 300;

const emptyMeta: PaginatedMeta = {
  page: 1,
  limit: EXAM_CATALOG_PAGE_SIZE,
  total: 0,
  totalPage: 1,
};

export function usePaginatedUserExams(variant: ExamCatalogVariant) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rawExams, setRawExams] = useState<(UserExam | UpcomingExam)[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>(emptyMeta);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, variant]);

  const fetchPage = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (variant === "upcoming") {
        const payload = await getUpcomingExams({
          page,
          limit: EXAM_CATALOG_PAGE_SIZE,
          searchTerm: debouncedSearch || undefined,
        });
        setRawExams(payload.data);
        setMeta(payload.meta);
      } else {
        const payload = await getUserExams({
          page,
          limit: EXAM_CATALOG_PAGE_SIZE,
          searchTerm: debouncedSearch || undefined,
          ...(variant === "subjective"
            ? { excludeSubject: "Model Test" }
            : {}),
        });
        setRawExams(payload.data);
        setMeta(payload.meta);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errorMessages?.[0]?.message || err.message);
      } else {
        setError("Could not load exams.");
      }
      setRawExams([]);
      setMeta(emptyMeta);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, variant]);

  useEffect(() => {
    void fetchPage();
  }, [fetchPage]);

  const exams = useMemo(() => {
    if (variant === "upcoming") {
      return rawExams as UpcomingExam[];
    }
    return (rawExams as UserExam[]).filter((exam) => isPreviousExam(exam));
  }, [rawExams, variant]);

  const canGoPrev = page > 1;
  const canGoNext = page < meta.totalPage;

  return {
    exams,
    meta,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    refresh: fetchPage,
    canGoPrev,
    canGoNext,
  };
}
