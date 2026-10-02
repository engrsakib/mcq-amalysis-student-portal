"use client";

import { BookThumbnail } from "@/components/dashboard/book-thumbnail";
import { buttonVariants } from "@/components/ui/button";
import type { UserBookEntry } from "@/lib/api/types";
import { formatBookPrice, formatSoldPlatform } from "@/lib/books/format-price";
import { cn } from "@/lib/utils";

type BookCardProps = {
  book: UserBookEntry;
  className?: string;
};

export function BookCard({ book, className }: BookCardProps) {
  const buyUrl = book.buy_url?.trim();
  const platform = formatSoldPlatform(book.sold_platform);

  return (
    <article
      className={cn(
        "flex h-full min-w-0 flex-col gap-3 rounded-xl border border-line/70 bg-card p-3 shadow-sm",
        className
      )}
    >
      <BookThumbnail thumbnailUrl={book.thumbnail_url} />

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">
          {book.title}
        </h3>
        <div>
          <p className="text-base font-semibold tabular-nums text-primary">
            {formatBookPrice(book.price)}
          </p>
          {platform ? (
            <p className="text-xs text-muted-foreground">via {platform}</p>
          ) : null}
        </div>
      </div>

      {buyUrl ? (
        <a
          href={buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "inline-flex h-10 w-full gap-2 rounded-[10px] border-primary/40 px-4 text-sm font-medium text-primary hover:bg-primary-soft"
          )}
        >
          Buy now
          <span
            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="size-2.5 fill-current">
              <path d="M8 5.5v13l10-6.5z" />
            </svg>
          </span>
        </a>
      ) : (
        <p className="text-sm text-muted-foreground">Link unavailable</p>
      )}
    </article>
  );
}
