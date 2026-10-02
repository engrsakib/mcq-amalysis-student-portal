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
    <div className={cn("border-b border-primary", className)}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          "flex items-end gap-1 sm:gap-2",
          scrollableOnMobile
            ? "scroll-pane-x -mx-1 flex-nowrap overflow-x-auto px-1 snap-x snap-mandatory sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
            : "flex-wrap",
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
                "relative inline-flex min-h-11 shrink-0 snap-start items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors sm:min-h-0 sm:px-4",
                scrollableOnMobile && "snap-start",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-page",
                active
                  ? "-mb-px z-[1] rounded-t-lg border border-primary border-b-page bg-page text-primary"
                  : "mb-0 border border-transparent text-muted-foreground hover:text-ink"
              )}
            >
              {Icon ? (
                <Icon
                  className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")}
                  aria-hidden
                />
              ) : null}
              {item.shortLabel ? (
                <>
                  <span className="sm:hidden">{item.shortLabel}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </>
              ) : (
                <span>{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
