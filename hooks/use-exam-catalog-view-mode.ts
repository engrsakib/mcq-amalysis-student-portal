"use client";

import { useEffect, useState } from "react";

export const EXAM_CATALOG_VIEW_STORAGE_KEY = "exam-catalog-view";

export type ExamCatalogViewMode = "card" | "list";

function parseStoredView(value: string | null): ExamCatalogViewMode {
  return value === "list" ? "list" : "card";
}

export function useExamCatalogViewMode() {
  const [viewMode, setViewMode] = useState<ExamCatalogViewMode>("card");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setViewMode(parseStoredView(localStorage.getItem(EXAM_CATALOG_VIEW_STORAGE_KEY)));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(EXAM_CATALOG_VIEW_STORAGE_KEY, viewMode);
    } catch {
      /* ignore */
    }
  }, [viewMode, hydrated]);

  return {
    viewMode: hydrated ? viewMode : "card",
    setViewMode,
  };
}
