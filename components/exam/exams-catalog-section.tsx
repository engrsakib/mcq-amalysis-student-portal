"use client";

import { useCallback, useEffect, useState } from "react";
import { ClipboardList, FilePenLine, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ExamGridCard,
  ExamGridCardSkeleton,
} from "@/components/exam/exam-grid-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FolderTabs } from "@/components/ui/folder-tabs";
import { Input } from "@/components/ui/input";
import { PaginationBar } from "@/components/ui/pagination-bar";
import {
  type ExamCatalogVariant,
  usePaginatedUserExams,
} from "@/hooks/use-paginated-user-exams";
const TABS = [
  { id: "previous" as const, label: "Previous exams", icon: ClipboardList },
  { id: "subjective" as const, label: "Subjective exams", icon: FilePenLine },
];

function tabFromParam(value: string | null): ExamCatalogVariant {
  return value === "subjective" ? "subjective" : "previous";
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

  const emptyCopy =
    variant === "subjective"
      ? "No subjective exams match your search."
      : "No previous exams match your search.";

  return (
    <section
      className="min-w-0 space-y-4"
      role="tabpanel"
      id={`folder-tabpanel-${variant}`}
      aria-labelledby={`folder-tab-${variant}`}
    >
      <h2 id="exams-catalog-heading" className="sr-only">
        Exam catalog
      </h2>

      <FolderTabs
        items={TABS}
        value={variant}
        onValueChange={selectTab}
        aria-label="Exam catalog"
      />

      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search exams…"
          className="h-10 bg-card pl-9 pr-9"
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

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load exams</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void refresh()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 8 }, (_, i) => (
            <ExamGridCardSkeleton key={i} />
          ))}
        </div>
      ) : exams.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-card/50 px-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">{emptyCopy}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <ExamGridCard key={exam._id} exam={exam} />
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
    </section>
  );
}
