"use client";

import type { LucideIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ContentEmptyState } from "@/components/ui/content-empty-state";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";
import type { CatalogViewMode } from "@/hooks/use-catalog-view-mode";
import { useIsSmUp } from "@/hooks/use-is-sm-up";
import type { PaginatedMeta } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function CatalogCardSkeleton() {
  return (
    <div className="flex min-h-[220px] animate-pulse flex-col overflow-hidden rounded-xl border border-line/60 bg-card p-3">
      <div className="aspect-video w-full rounded-lg bg-primary-soft/40" />
      <div className="mt-3 h-4 w-3/4 rounded bg-primary-soft/40" />
      <div className="mt-2 h-9 w-full rounded-lg bg-primary-soft/30" />
    </div>
  );
}

function CatalogListSkeleton() {
  return (
    <div className="flex animate-pulse gap-3 rounded-xl border border-line/60 bg-card p-3">
      <div className="size-20 shrink-0 rounded-lg bg-primary-soft/40 sm:size-24" />
      <div className="min-w-0 flex-1 space-y-2 py-1">
        <div className="h-4 w-2/3 rounded bg-primary-soft/40" />
        <div className="h-9 w-32 rounded-lg bg-primary-soft/30" />
      </div>
    </div>
  );
}

export type PaginatedCatalogPanelProps<T extends { _id: string }> = {
  items: T[];
  meta: PaginatedMeta;
  page: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  searchPlaceholder: string;
  searchAriaLabel: string;
  viewMode: CatalogViewMode;
  onViewModeChange: (mode: CatalogViewMode) => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  errorTitle?: string;
  emptyMessage: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  renderCard: (item: T) => React.ReactNode;
  renderListRow: (item: T) => React.ReactNode;
  skeletonCount?: number;
  className?: string;
};

export function PaginatedCatalogPanel<T extends { _id: string }>({
  items,
  meta,
  page,
  onPageChange,
  searchTerm,
  onSearchTermChange,
  searchPlaceholder,
  searchAriaLabel,
  viewMode,
  onViewModeChange,
  loading,
  error,
  onRetry,
  errorTitle = "Could not load items",
  emptyMessage,
  emptyDescription,
  emptyIcon,
  renderCard,
  renderListRow,
  skeletonCount = 6,
  className,
}: PaginatedCatalogPanelProps<T>) {
  const isSmUp = useIsSmUp();
  const displayViewMode = isSmUp ? viewMode : "card";

  return (
    <div className={cn("min-w-0 space-y-4", className)}>
      <CatalogToolbar
        searchTerm={searchTerm}
        onSearchTermChange={onSearchTermChange}
        placeholder={searchPlaceholder}
        searchAriaLabel={searchAriaLabel}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>{errorTitle}</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        displayViewMode === "card" ? (
          <div className="grid touch-pan-y grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: skeletonCount }, (_, i) => (
              <CatalogCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="flex touch-pan-y flex-col gap-3">
            {Array.from({ length: skeletonCount }, (_, i) => (
              <CatalogListSkeleton key={i} />
            ))}
          </div>
        )
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-card/50">
          <ContentEmptyState
            icon={emptyIcon}
            title={emptyMessage}
            description={emptyDescription}
          />
        </div>
      ) : displayViewMode === "card" ? (
        <div className="grid touch-pan-y grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="touch-pan-y">
              {renderCard(item)}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex touch-pan-y flex-col gap-3">
          {items.map((item) => (
            <div key={item._id} className="touch-pan-y">
              {renderListRow(item)}
            </div>
          ))}
        </div>
      )}

      {!loading && !error && meta.totalPage > 1 ? (
        <PaginationBar
          page={page}
          totalPages={meta.totalPage}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}
