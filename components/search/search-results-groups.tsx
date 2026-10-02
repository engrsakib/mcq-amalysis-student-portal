"use client";

import Link from "next/link";
import { SearchResultRow } from "@/components/search/search-result-row";
import type {
  GlobalSearchResults,
  SearchGuidelineEntry,
  UserBookEntry,
  UserExam,
  UserStudyPlanEntry,
  UserYoutubeEntry,
} from "@/lib/api/types";
import { formatBookPrice } from "@/lib/books/format-price";

type SearchResultsGroupsProps = {
  results: GlobalSearchResults;
  onNavigate: () => void;
  onExam: (exam: UserExam) => void;
  onBook: (book: UserBookEntry) => void;
  onYoutube: (entry: UserYoutubeEntry) => void;
  onStudyPlan: (entry: UserStudyPlanEntry) => void;
  onGuideline: (entry: SearchGuidelineEntry) => void;
};

type SectionProps<T> = {
  title: string;
  section: { meta: { total: number; totalPage?: number }; data: T[] };
  browseHref?: string;
  browseLabel?: string;
  renderRow: (item: T) => React.ReactNode;
};

function SearchSection<T>({
  title,
  section,
  browseHref,
  browseLabel,
  renderRow,
}: SectionProps<T>) {
  if (section.meta.total <= 0) return null;

  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between gap-2 px-0.5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
          <span className="ml-1.5 font-normal tabular-nums text-muted-foreground/80">
            ({section.meta.total})
          </span>
        </h2>
        {browseHref && browseLabel && (section.meta.totalPage ?? 1) > 1 ? (
          <Link
            href={browseHref}
            className="shrink-0 text-xs font-medium text-primary hover:underline"
          >
            {browseLabel}
          </Link>
        ) : null}
      </div>
      <ul className="flex flex-col gap-2">{section.data.map(renderRow)}</ul>
    </section>
  );
}

export function SearchResultsGroups({
  results,
  onNavigate,
  onExam,
  onBook,
  onYoutube,
  onStudyPlan,
  onGuideline,
}: SearchResultsGroupsProps) {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <SearchSection
        title="Exams"
        section={results.exams}
        browseHref="/exam"
        browseLabel="Browse all exams"
        renderRow={(exam) => (
          <li key={exam._id}>
            <SearchResultRow
              title={exam.exam_name}
              meta={exam.subject}
              thumbnailUrl={null}
              onClick={() => {
                onNavigate();
                onExam(exam);
              }}
            />
          </li>
        )}
      />
      <SearchSection
        title="Books"
        section={results.books}
        browseHref="/"
        browseLabel="View on dashboard"
        renderRow={(book) => (
          <li key={book._id}>
            <SearchResultRow
              title={book.title}
              meta={formatBookPrice(book.price)}
              thumbnailUrl={book.thumbnail_url}
              onClick={() => {
                onNavigate();
                onBook(book);
              }}
            />
          </li>
        )}
      />
      <SearchSection
        title="YouTube"
        section={results.youtube}
        browseHref="/learning-materials?tab=youtube"
        browseLabel="Learning materials"
        renderRow={(entry) => (
          <li key={entry._id}>
            <SearchResultRow
              title={entry.title}
              meta="Video"
              thumbnailUrl={entry.thumbnail_url}
              onClick={() => {
                onNavigate();
                onYoutube(entry);
              }}
            />
          </li>
        )}
      />
      <SearchSection
        title="Study plans"
        section={results.studyPlans}
        browseHref="/learning-materials?tab=study-plan"
        browseLabel="Learning materials"
        renderRow={(entry) => (
          <li key={entry._id}>
            <SearchResultRow
              title={entry.title}
              meta={entry.category}
              thumbnailUrl={entry.thumbnail_url}
              onClick={() => {
                onNavigate();
                onStudyPlan(entry);
              }}
            />
          </li>
        )}
      />
      <SearchSection
        title="Guidelines"
        section={results.guidelines}
        browseHref="/learning-materials?tab=guideline"
        browseLabel="Learning materials"
        renderRow={(entry) => (
          <li key={entry._id}>
            <SearchResultRow
              title={entry.title}
              meta={entry.description}
              thumbnailUrl={entry.thumbnail_url}
              onClick={() => {
                onNavigate();
                onGuideline(entry);
              }}
            />
          </li>
        )}
      />
    </div>
  );
}

export function hasAnySearchResults(results: GlobalSearchResults): boolean {
  return (
    results.exams.meta.total > 0 ||
    results.books.meta.total > 0 ||
    results.youtube.meta.total > 0 ||
    results.studyPlans.meta.total > 0 ||
    results.guidelines.meta.total > 0
  );
}
