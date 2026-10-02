"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  ClipboardList,
  FilePenLine,
  LayoutGrid,
  List,
  Search,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ExamGridCard,
  ExamGridCardSkeleton,
} from "@/components/exam/exam-grid-card";
import { ExamListRow, ExamListRowSkeleton } from "@/components/exam/exam-list-row";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { FolderTabItem } from "@/components/ui/folder-tabs";
import { Input } from "@/components/ui/input";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { TabbedFolderView } from "@/components/ui/tabbed-folder-view";
import { useExamCatalogViewMode } from "@/hooks/use-exam-catalog-view-mode";
import { useIsSmUp } from "@/hooks/use-is-sm-up";
import {
  type ExamCatalogVariant,
  usePaginatedUserExams,
} from "@/hooks/use-paginated-user-exams";
import type { ExamBriefingSource } from "@/lib/exam/briefing-mode";
import { cn } from "@/lib/utils";

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
  const isSmUp = useIsSmUp();
  const displayViewMode = isSmUp ? viewMode : "card";

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
        <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exams…"
              className="h-9 bg-card pl-9 pr-9 text-sm"
              aria-label="Search exams"
            />
            {searchTerm ? (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-primary-soft hover:text-ink"
                aria-label="Clear search"
                onClick={() => setSearchTerm("")}
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          <div
            role="group"
            aria-label="Exam layout"
            className="hidden shrink-0 rounded-lg border border-line bg-card p-0.5 sm:flex"
          >
            <button
              type="button"
              aria-label="Card view"
              aria-pressed={viewMode === "card"}
              onClick={() => setViewMode("card")}
              className={cn(
                "rounded-md p-2 transition-colors",
                viewMode === "card"
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:text-ink"
              )}
            >
              <LayoutGrid className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded-md p-2 transition-colors",
                viewMode === "list"
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:text-ink"
              )}
            >
              <List className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load exams</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center gap-3">
              <span>{error}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void refresh()}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}

        {loading ? (
          displayViewMode === "card" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 8 }, (_, i) => (
                <ExamGridCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 8 }, (_, i) => (
                <ExamListRowSkeleton key={i} />
              ))}
            </div>
          )
        ) : exams.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-card/50 px-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">{emptyCopy}</p>
          </div>
        ) : displayViewMode === "card" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <ExamGridCard
                key={exam._id}
                exam={exam}
                briefingSource={briefingSource}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {exams.map((exam) => (
              <ExamListRow
                key={exam._id}
                exam={exam}
                briefingSource={briefingSource}
              />
            ))}
          </div>
        )}

        {!loading && !error && meta.totalPage > 1 ? (
          <PaginationBar
            page={page}
            totalPages={meta.totalPage}
            onPageChange={setPage}
          />
        ) : null}
        </div>
      </TabbedFolderView>
    </div>
  );
}
