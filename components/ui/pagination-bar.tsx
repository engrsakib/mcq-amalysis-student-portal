"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPaginationItems } from "@/lib/pagination/page-items";
import { cn } from "@/lib/utils";

type PaginationBarProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Shown on sm+ beside controls */
  summaryLabel?: string;
};

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  className,
  summaryLabel,
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  const items = getPaginationItems(page, totalPages);
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <nav
      className={cn(
        "flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      aria-label="Pagination"
    >
      {summaryLabel ? (
        <p className="text-sm text-muted-foreground">{summaryLabel}</p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-1 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1 rounded-lg px-2.5"
          disabled={!canGoPrev}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4 shrink-0" aria-hidden />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <ul className="flex items-center gap-0.5">
          {items.map((item, index) =>
            item === "ellipsis" ? (
              <li
                key={`ellipsis-${index}`}
                className="flex size-9 items-center justify-center text-muted-foreground"
                aria-hidden
              >
                <MoreHorizontal className="size-4" />
              </li>
            ) : (
              <li key={item}>
                <Button
                  type="button"
                  variant={item === page ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "size-9 min-w-9 rounded-lg p-0 text-sm font-medium tabular-nums",
                    item === page &&
                      "bg-primary text-primary-foreground hover:bg-primary-hover"
                  )}
                  aria-label={`Page ${item}`}
                  aria-current={item === page ? "page" : undefined}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </Button>
              </li>
            )
          )}
        </ul>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1 rounded-lg px-2.5"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4 shrink-0" aria-hidden />
        </Button>
      </div>
    </nav>
  );
}
