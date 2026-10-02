"use client";

import {
  useCatalogViewMode,
  type CatalogViewMode,
} from "@/hooks/use-catalog-view-mode";

export const EXAM_CATALOG_VIEW_STORAGE_KEY = "exam-catalog-view";

export type ExamCatalogViewMode = CatalogViewMode;

export function useExamCatalogViewMode() {
  return useCatalogViewMode(EXAM_CATALOG_VIEW_STORAGE_KEY);
}
