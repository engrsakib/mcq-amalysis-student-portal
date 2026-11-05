import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DeveloperSection } from "@/components/docs/developer-section";
import {
  FOUNDER_BOOKS,
  FOUNDER_BOOKS_PATH,
} from "@/lib/docs/founder-profile-data";
import { cn } from "@/lib/utils";

export function FounderBooksPreview() {
  const preview = FOUNDER_BOOKS.slice(0, 6);

  return (
    <DeveloperSection
      id="books"
      title="Books"
      description="Exam analysis, model tests, and career titles trusted by students nationwide."
    >
      <ul className="grid gap-2 sm:grid-cols-2">
        {preview.map((book) => (
          <li
            key={book.id}
            className="flex items-start gap-2 rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-ink"
          >
            <BookOpen
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden
            />
            <span className="leading-snug">{book.title}</span>
          </li>
        ))}
      </ul>
      {FOUNDER_BOOKS.length > preview.length ? (
        <p className="mt-2 text-xs text-ink">
          +{FOUNDER_BOOKS.length - preview.length} more titles on the books page
        </p>
      ) : null}
      <Link
        href={FOUNDER_BOOKS_PATH}
        className={cn(
          buttonVariants({ variant: "default" }),
          "mt-4 h-11 gap-2 bg-primary px-5 hover:bg-primary-hover"
        )}
      >
        Buy books
        <ChevronRight className="size-4" aria-hidden />
      </Link>
    </DeveloperSection>
  );
}
