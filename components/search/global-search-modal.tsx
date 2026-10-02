"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import {
  hasAnySearchResults,
  SearchResultsGroups,
} from "@/components/search/search-results-groups";
import { useSearchModal } from "@/components/search/search-provider";
import { Button } from "@/components/ui/button";
import { ContentEmptyState } from "@/components/ui/content-empty-state";
import { Input } from "@/components/ui/input";
import { useGlobalSearch } from "@/hooks/use-global-search";
import type {
  SearchGuidelineEntry,
  UserBookEntry,
  UserExam,
  UserStudyPlanEntry,
  UserYoutubeEntry,
} from "@/lib/api/types";

function SearchRowsSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex min-h-11 animate-pulse items-center gap-3 rounded-xl border border-line/70 bg-card px-3 py-2.5"
        >
          <div className="size-11 shrink-0 rounded-lg bg-primary-soft/60" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3.5 w-3/4 rounded bg-primary-soft/60" />
            <div className="h-3 w-1/2 rounded bg-primary-soft/40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GlobalSearchModal() {
  const router = useRouter();
  const { open, closeSearch } = useSearchModal();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, loading, error, refetch, reset, debouncedQuery } =
    useGlobalSearch(query, open);

  useEffect(() => {
    if (!open) {
      setQuery("");
      reset();
      return;
    }
    const id = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeSearch]);

  const closeAndNavigate = useCallback(() => {
    closeSearch();
  }, [closeSearch]);

  const onExam = useCallback(
    (exam: UserExam) => {
      router.push(`/exam/${exam.exam_number}`);
    },
    [router]
  );

  const onBook = useCallback((book: UserBookEntry) => {
    const url = book.buy_url?.trim();
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const onYoutube = useCallback((entry: UserYoutubeEntry) => {
    const url = entry.video_url?.trim();
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const onStudyPlan = useCallback(
    (entry: UserStudyPlanEntry) => {
      const url = entry.study_plan_url?.trim();
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        router.push("/learning-materials?tab=study-plan");
      }
    },
    [router]
  );

  const onGuideline = useCallback(
    (_entry: SearchGuidelineEntry) => {
      router.push("/learning-materials?tab=guideline");
    },
    [router]
  );

  if (!open) return null;

  const trimmed = query.trim();
  const showIdle = trimmed.length < 1;
  const showEmpty =
    !showIdle &&
    !loading &&
    !error &&
    debouncedQuery.length >= 1 &&
    data &&
    !hasAnySearchResults(data.results);

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col bg-page"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="sticky top-0 z-10 border-b border-line bg-page px-4 py-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exams, books, videos…"
              className="h-11 pl-9 pr-10 text-base"
              autoComplete="off"
              enterKeyHint="search"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-primary-soft hover:text-ink"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-11 shrink-0"
            onClick={closeSearch}
            aria-label="Close search"
          >
            <X className="size-5" />
          </Button>
        </div>
      </div>

      <div className="scroll-pane min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="mx-auto w-full max-w-2xl">
          {showIdle ? (
            <ContentEmptyState
              title="Type to search"
              description="Find exams, books, YouTube videos, study plans, and guidelines."
              icon={Search}
            />
          ) : null}

          {loading && debouncedQuery ? <SearchRowsSkeleton /> : null}

          {error ? (
            <div className="space-y-3 py-6 text-center">
              <p className="text-sm text-danger">{error}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
                Retry
              </Button>
            </div>
          ) : null}

          {showEmpty ? (
            <ContentEmptyState
              title="No results"
              description={`Nothing matched “${debouncedQuery}”. Try different keywords.`}
              icon={Search}
            />
          ) : null}

          {data && !loading && hasAnySearchResults(data.results) ? (
            <SearchResultsGroups
              results={data.results}
              onNavigate={closeAndNavigate}
              onExam={onExam}
              onBook={onBook}
              onYoutube={onYoutube}
              onStudyPlan={onStudyPlan}
              onGuideline={onGuideline}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
