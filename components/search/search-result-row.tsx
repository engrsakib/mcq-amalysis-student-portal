"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchResultRowProps = {
  title: string;
  meta?: string;
  thumbnailUrl?: string | null;
  onClick: () => void;
  className?: string;
};

export function SearchResultRow({
  title,
  meta,
  thumbnailUrl,
  onClick,
  className,
}: SearchResultRowProps) {
  const thumb = thumbnailUrl?.trim();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-11 w-full items-center gap-3 rounded-xl border border-line/70 bg-card px-3 py-2.5 text-left transition-colors hover:bg-primary-soft/40",
        className
      )}
    >
      <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-primary-soft/50">
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover"
            sizes="44px"
            unoptimized
          />
        ) : (
          <span
            className="flex size-full items-center justify-center text-xs font-semibold text-primary"
            aria-hidden
          >
            ·
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-medium text-ink">{title}</p>
        {meta ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{meta}</p>
        ) : null}
      </div>
      <ChevronRight
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden
      />
    </button>
  );
}
