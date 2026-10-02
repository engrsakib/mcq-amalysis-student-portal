"use client";

import { LayoutGrid, List, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CatalogViewMode } from "@/hooks/use-catalog-view-mode";
import { cn } from "@/lib/utils";

type CatalogToolbarProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  placeholder: string;
  searchAriaLabel: string;
  viewMode: CatalogViewMode;
  onViewModeChange: (mode: CatalogViewMode) => void;
  layoutAriaLabel?: string;
  className?: string;
};

export function CatalogToolbar({
  searchTerm,
  onSearchTermChange,
  placeholder,
  searchAriaLabel,
  viewMode,
  onViewModeChange,
  layoutAriaLabel = "Catalog layout",
  className,
}: CatalogToolbarProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          placeholder={placeholder}
          className="h-9 bg-card pl-9 pr-9 text-sm"
          aria-label={searchAriaLabel}
        />
        {searchTerm ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-primary-soft hover:text-ink"
            aria-label="Clear search"
            onClick={() => onSearchTermChange("")}
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <div
        role="group"
        aria-label={layoutAriaLabel}
        className="hidden shrink-0 rounded-lg border border-line bg-card p-0.5 sm:flex"
      >
        <button
          type="button"
          aria-label="Card view"
          aria-pressed={viewMode === "card"}
          onClick={() => onViewModeChange("card")}
          className={cn(
            "flex min-h-11 min-w-11 items-center justify-center rounded-md transition-colors",
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
          onClick={() => onViewModeChange("list")}
          className={cn(
            "flex min-h-11 min-w-11 items-center justify-center rounded-md transition-colors",
            viewMode === "list"
              ? "bg-primary-soft text-primary"
              : "text-muted-foreground hover:text-ink"
          )}
        >
          <List className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
