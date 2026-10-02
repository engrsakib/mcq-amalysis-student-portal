"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  ClipboardList,
  FilePenLine,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginatedCatalogPanel } from "@/components/catalog/paginated-catalog-panel";
import { ExamGridCard } from "@/components/exam/exam-grid-card";
import { ExamListRow } from "@/components/exam/exam-list-row";
import type { FolderTabItem } from "@/components/ui/folder-tabs";
import { TabbedFolderView } from "@/components/ui/tabbed-folder-view";
import { useExamCatalogViewMode } from "@/hooks/use-exam-catalog-view-mode";
import {
  type ExamCatalogVariant,
  usePaginatedUserExams,
} from "@/hooks/use-paginated-user-exams";
import type { ExamBriefingSource } from "@/lib/exam/briefing-mode";

const TABS: readonly FolderTabItem<ExamCatalogVariant>[] = [
  {
    id: "previous",
    label: "Previous exams",
    shortLabel: "Previous",
    icon: ClipboardList,
  },
  {
    id: "subjective",
    label: "Subjective exams",
    shortLabel: "Subjective",
    icon: FilePenLine,
  },
  {
    id: "upcoming",
    label: "Upcoming exams",
    shortLabel: "Upcoming",
    icon: CalendarClock,
  },
];

function tabFromParam(value: string | null): ExamCatalogVariant {
  if (value === "subjective") return "subjective";
  if (value === "upcoming") return "upcoming";
  return "previous";
}

function briefingSourceForVariant(
  variant: ExamCatalogVariant
): ExamBriefingSource {
  return variant === "upcoming" ? "upcoming" : "previous";
}

export function ExamsCatalogSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [variant, setVariant] = useState<ExamCatalogVariant>(() =>
    tabFromParam(searchParams.get("tab"))
  );

  useEffect(() => {
    setVariant(tabFromParam(searchParams.get("tab")));
  }, [searchParams]);

  const {
    exams,
    meta,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    refresh,
  } = usePaginatedUserExams(variant);
  const { viewMode, setViewMode } = useExamCatalogViewMode();

  const selectTab = useCallback(
    (next: ExamCatalogVariant) => {
      setVariant(next);
      const params = new URLSearchParams(searchParams.toString());
      if (next === "previous") {
        params.delete("tab");
      } else {
        params.set("tab", next);
      }
      const qs = params.toString();
      router.replace(qs ? `/exam?${qs}` : "/exam", { scroll: false });
    },
    [router, searchParams]
  );

  const briefingSource = briefingSourceForVariant(variant);

  const emptyCopy =
    variant === "subjective"
      ? "No subjective exams match your search."
      : variant === "upcoming"
        ? "No upcoming exams match your search."
        : "No previous exams match your search.";

  return (
    <div className="min-w-0">
      <h2 id="exams-catalog-heading" className="sr-only">
        Exam catalog
      </h2>

      <TabbedFolderView
        items={TABS}
        value={variant}
        onValueChange={selectTab}
        aria-label="Exam catalog"
        scrollableOnMobile
      >
        <PaginatedCatalogPanel
          items={exams}
          meta={meta}
          page={page}
          onPageChange={setPage}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          searchPlaceholder="Search exams…"
          searchAriaLabel="Search exams"
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          loading={loading}
          error={error}
          onRetry={() => void refresh()}
          errorTitle="Could not load exams"
          emptyMessage={emptyCopy}
          skeletonCount={8}
          renderCard={(exam) => (
            <ExamGridCard exam={exam} briefingSource={briefingSource} />
          )}
          renderListRow={(exam) => (
            <ExamListRow exam={exam} briefingSource={briefingSource} />
          )}
        />
      </TabbedFolderView>
    </div>
  );
}
