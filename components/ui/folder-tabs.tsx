"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type FolderTabItem<T extends string = string> = {
  id: T;
  label: string;
  /** Shown below `sm` when set; full `label` from `sm` and up */
  shortLabel?: string;
  icon?: LucideIcon;
};

type FolderTabsProps<T extends string> = {
  items: readonly FolderTabItem<T>[];
  value: T;
  onValueChange: (id: T) => void;
  className?: string;
  listClassName?: string;
  scrollableOnMobile?: boolean;
  "aria-label"?: string;
};

export function FolderTabs<T extends string>({
  items,
  value,
  onValueChange,
  className,
  listClassName,
  scrollableOnMobile = false,
  "aria-label": ariaLabel = "Tabs",
}: FolderTabsProps<T>) {
  return (
    <div
      className={cn(
        scrollableOnMobile ? "border-b border-line sm:border-primary" : "border-b border-primary",
        className
      )}
    >
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          scrollableOnMobile
            ? "grid grid-cols-2 gap-1.5 p-0.5 pb-2 sm:flex sm:flex-wrap sm:items-end sm:gap-2 sm:p-0 sm:pb-0"
            : "flex flex-wrap items-end gap-1 sm:gap-2",
          listClassName
        )}
      >
        {items.map((item) => {
          const active = value === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`folder-tab-${item.id}`}
              aria-selected={active}
              aria-controls={`folder-tabpanel-${item.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onValueChange(item.id)}
              className={cn(
                "relative inline-flex min-h-11 items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-medium transition-colors sm:min-h-0 sm:justify-start sm:gap-2 sm:px-4 sm:text-sm",
                scrollableOnMobile && "w-full rounded-lg sm:w-auto sm:rounded-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-page",
                active
                  ? scrollableOnMobile
                    ? "z-[1] border border-primary bg-primary-soft text-primary shadow-sm sm:-mb-px sm:rounded-t-lg sm:border-b-page sm:bg-page sm:shadow-none"
                    : "-mb-px z-[1] rounded-t-lg border border-primary border-b-page bg-page text-primary"
                  : scrollableOnMobile
                    ? "border border-line/70 bg-card text-muted-foreground hover:border-line hover:bg-primary-soft/40 hover:text-ink sm:mb-0 sm:border-transparent sm:bg-transparent"
                    : "mb-0 border border-transparent text-muted-foreground hover:text-ink"
              )}
            >
              {Icon ? (
                <Icon
                  className={cn(
                    "size-3.5 shrink-0 sm:size-4",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                  aria-hidden
                />
              ) : null}
              {item.shortLabel ? (
                <>
                  <span className="truncate sm:hidden">{item.shortLabel}</span>
                  <span className="hidden truncate sm:inline">{item.label}</span>
                </>
              ) : (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
